import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuDatHang } from '@app/shared/entities';
import { NguoiDungService, PhieuDatHangService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import moment from 'moment';

@Component({
    selector: 'app-phieu-khach-dat-hang-in-phieu-modal',
    templateUrl: './phieu-khach-dat-hang-in-phieu-modal.component.html',
    styleUrls: ['./phieu-khach-dat-hang-in-phieu-modal.component.css']
})
export class PhieuKhachDatHangInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieudathang_id: number;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalPhieuKhachDatHangInPhieu'
    };

    constructor(public bsModalRef: BsModalRef, private objPhieuKhachDatHangService: PhieuDatHangService, private authenticationService: AuthenticationService,private nguoidungService: NguoiDungService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.nguoidungService
            .getCurrentUser()
            .toPromise()
            .then((rs) => {
                this.currentUser = rs;
                this.onLoadData();
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuKhachDatHangService.findPhieuDatHang(this.phieudathang_id).subscribe(
                (data) => {
                     /*khởi tạo report */
                     let report = new Stimulsoft.Report.StiReport();
                     report.loadFile('assets/reports/design/ban-hang/rptPhieuDatHangSanXuat.mrt');

                      /*xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /* Thông tin chung in phiếu */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuDatHang = new Stimulsoft.System.Data.DataSet();

                    /* Thông tin phiếu */
                    data.ngaylapphieu = moment(data.ngaydathang).format('DD/MM/YYYY');
                    data.ngayhengiao = moment(data.ngaygiaohang).format('DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;
                    data.tongtien_bangchu = number2vn(data.tongthanhtien);

                    /* Thông tin chi tiết phiếu */
                    data.phieudathang_sanxuatchitiets.forEach((item) => {
                        item.chietkhau = data.chietkhau != 0 ? data.chietkhau : item.chietkhau;
                        item.thuevat   = data.thuevat   != 0 ? data.thuevat   : item.thuevat  ;
                        item.dongiavat = item.dongia - item.dongia * item.chietkhau + (item.dongia - item.dongia * item.chietkhau) * item.thuevat;

                        // làm tròn đơn giá vat và thành tiền
                        item.dongiavat = Math.round(      item.dongiavat);
                        item.thanhtien = item.dongiavat * item.soluong   ;
                    });

                    dsPhieuDatHang.readJson({ rptPhieuDatHangSanXuat: data, rptPhieuDatHangSanXuat_ChiTiet: data.phieudathang_sanxuatchitiets });
                    report.regData('rptPhieuDatHangSanXuat', null, dsPhieuDatHang);

                    /* đổi logo phiếu in */
                    var imageLogo = Stimulsoft.System.Drawing.Image.fromFile(this.authenticationService.currentChiNhanhValue.logo_url);
                    report.dictionary.variables.getByName('LogoComapny').valueObject = imageLogo;

                    /* render report */
                    this.reportOptions.appearance.showTooltipsHelp = false;
                    this.reportOptions.toolbar.showOpenButton = false;
                    this.reportOptions.toolbar.showAboutButton = false;
                    this.reportOptions.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;

                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');
                },
                (error) => {
                    this.objPhieuKhachDatHangService.handleError(error);
                }
            )
        );
    }
              

    onRowDblClick(e) {
        this.onConfirm(e.key);
    }

    public onConfirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
