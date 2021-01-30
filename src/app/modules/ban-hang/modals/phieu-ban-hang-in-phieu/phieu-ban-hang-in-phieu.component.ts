import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PhieuBanHang } from '@app/shared/entities';
import { NguoiDungService, PhieuBanHangService, ThongKeThuChiService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { StringLengthRule } from 'devextreme/ui/validation_engine';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';

@Component({
    selector: 'app-phieu-ban-hang-in-phieu',
    templateUrl: './phieu-ban-hang-in-phieu.component.html',
    styleUrls: ['./phieu-ban-hang-in-phieu.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuBanHangInPhieuComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieubanhang_id: number;
    public loaiphieuxuatkho: string;

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuBanHangService: PhieuBanHangService, private authenticationService: AuthenticationService) {}

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
        this.subscription.unsubscribe();
    }

    onLoadData() {
        this.subscription.add(
            this.objPhieuBanHangService.findPhieuBanHang(this.phieubanhang_id).subscribe(
                (data) => {
                    /*khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();
                    report.loadFile('assets/reports/design/ban-hang/rptPhieuYeuCauXuatKho.mrt');

                    /*xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin chung in phiếu */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJsonFile('assets/reports/json/Info.json');
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuBanHang = new Stimulsoft.System.Data.DataSet();

                    /*Thông tin phiếu */

                    data.ngaylapphieu = moment(data.ngaybanhang).format('HH:mm DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;
                    data.tongtien_bangchu = number2vn(data.tongthanhtien);

                    /*Thông tin chi tiết phiếu */
                    if (data.chietkhau > 0) {
                        data.phieubanhang_chitiet.forEach((item) => {
                            item.chietkhau = data.chietkhau;
                            item.thanhtien = item.soluong * item.dongia;
                            item.thanhtien = item.thanhtien - item.thanhtien * item.chietkhau + (item.thanhtien - item.thanhtien * item.chietkhau) * item.thuevat;
                        });
                    }
                    if (data.thuevat > 0) {
                        data.phieubanhang_chitiet.forEach((item) => {
                            item.thuevat = data.thuevat;
                            item.thanhtien = item.soluong * item.dongia;
                            item.thanhtien = item.thanhtien - item.thanhtien * item.chietkhau + (item.thanhtien - item.thanhtien * item.chietkhau) * item.thuevat;
                        });
                    }
                    dsPhieuBanHang.readJson({ rptPhieuYeuCauXuatKho: data, rptPhieuYeuCauXuatKho_ChiTiet: data.phieubanhang_chitiet });
                    report.regData('rptPhieuYeuCauXuatKho', null, dsPhieuBanHang);

                    /* render report */
                    this.reportOptions.appearance.showTooltipsHelp = false;
                    this.reportOptions.toolbar.showOpenButton = false;
                    this.reportOptions.toolbar.showAboutButton = false;
                    this.reportOptions.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
                    
                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');
                },
                (error) => {
                    this.objPhieuBanHangService.handleError(error);
                }
            )
        );
    }

    public onConfirm(): void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
