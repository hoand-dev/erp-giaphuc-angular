import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { NguoiDungService, PhieuNhapKhoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { User } from '@app/_models';

@Component({
    selector: 'app-phieu-nhap-kho-in-phieu-modal',
    templateUrl: './phieu-nhap-kho-in-phieu-modal.component.html',
    styleUrls: ['./phieu-nhap-kho-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuNhapKhoInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieunhapkho_id: number;
    public loaiphieunhap: string;
    public loaiphieuin: string = 'cogia'; // cogia or khonggia

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuNhapKhoService: PhieuNhapKhoService, private authenticationService: AuthenticationService) {}

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
            this.objPhieuNhapKhoService.findPhieuNhapKho(this.phieunhapkho_id).subscribe(
                (data) => {
                    /* khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();

                    /* kiểm tra loại phiếu để lấy đúng mẫu report */
                    if (this.loaiphieuin == 'cogia' && this.loaiphieunhap == 'nhapmuahang') {
                        report.loadFile('assets/reports/design/kho-hang/rptPhieuNhapKho_MuaHang_CoGia.mrt');
                    }
                    if (this.loaiphieuin == 'khonggia' && this.loaiphieunhap == 'nhapmuahang') {
                        report.loadFile('assets/reports/design/kho-hang/rptPhieuNhapKho_MuaHang_KhongGia.mrt');
                    }
                    if (this.loaiphieuin == 'cogia' && this.loaiphieunhap == 'nhapkhachtrahang') {
                        report.loadFile('assets/reports/design/kho-hang/rptPhieuNhapKho_TraHang_CoGia.mrt');
                    }
                    if (this.loaiphieuin == 'khonggia' && this.loaiphieunhap == 'nhapkhachtrahang') {
                        report.loadFile('assets/reports/design/kho-hang/rptPhieuNhapKho_TraHang_KhongGia.mrt');
                    }

                    /* xoá dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin chung phiếu in */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuNhapKho = new Stimulsoft.System.Data.DataSet();
                    /* thông tin phiếu */
                    data.ngaylapphieu = moment(data.ngaynhapkho).format('DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;
                    data.tongthanhtien_bangchu = number2vn(data.tongthanhtien);

                    /* thông tin chi tiết phiếu */
                    data.phieunhapkho_chitiets.forEach((item) => {
                        item.chietkhau = data.chietkhau != 0 ? data.chietkhau : item.chietkhau;
                        item.thuevat = data.thuevat != 0 ? data.thuevat : item.thuevat;
                        item.dongiavat = item.dongia - item.dongia * item.chietkhau + (item.dongia - item.dongia * item.chietkhau) * item.thuevat;

                        // làm tròn đơn giá vat và thành tiền
                        if (data.loaiphieunhapkho == 'nhapkhachtrahang') {
                            item.dongiavat = Math.round(item.dongiavat);
                        }
                        item.thanhtien = item.dongiavat * item.soluong;
                    });

                    dsPhieuNhapKho.readJson({ rptThongTinPhieu: data, rptThongTinHangHoa: data.phieunhapkho_chitiets });
                    report.regData('rptPhieuNhapKho', null, dsPhieuNhapKho);

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
                    this.objPhieuNhapKhoService.handleError(error);
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
