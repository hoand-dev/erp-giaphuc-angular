import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuYeuCauGiaCongService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

declare var Stimulsoft: any;

@Component({
    selector: 'app-phieu-yeu-cau-gia-cong-in-phieu-modal',
    templateUrl: './phieu-yeu-cau-gia-cong-in-phieu-modal.component.html',
    styleUrls: ['./phieu-yeu-cau-gia-cong-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuYeuCauGiaCongInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public loaiphieuin: string = 'hangtron';

    private currentUser: User;
    public phieuyeucaugiacong_id: number;
    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuYeuCauGiaCongService: PhieuYeuCauGiaCongService,
        private authenticationService: AuthenticationService
    ) {}

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
            this.objPhieuYeuCauGiaCongService.findPhieuYeuCauGiaCong(this.phieuyeucaugiacong_id).subscribe(
                (data) => {
                    /* Khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();
                    if(this.loaiphieuin =='yeucau'){
                        report.loadFile('assets/reports/design/san-xuat/rptPhieuYeuCauGiaCong.mrt');
                    }
                    if(this.loaiphieuin == 'hangtron'){
                        report.loadFile('assets/reports/design/san-xuat/rptPhieuXuatGiaCongTrenFormYeuCauGiaCong.mrt');
                    }
                    if(this.loaiphieuin == 'tattoan'){
                        report.loadFile('assets/reports/design/san-xuat/rptPhieuNhapHangTatToan.mrt');
                    }

                    /* Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin công ty */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    /*Thông tin chi chiết phiếu */
                    let dsPhieuYeuCauGiaCong = new Stimulsoft.System.Data.DataSet();
                    data.ngaylapphieu = moment(data.ngayyeucaugiacong).format('DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;

                    data.phieuyeucaugiacong_chitiets.forEach((x) => {
                        x.chuthich = (x.chuthich ? x.chuthich : '') + (x.tenkhachhang ? ' ' + x.tenkhachhang : '');
                        x.chuthich = x.chuthich.trim();
                    });

                    dsPhieuYeuCauGiaCong.readJson({ rptPhieuYeuCauGiaCong: data, rptPhieuYeuCauGiaCong_ChiTiet: data.phieuyeucaugiacong_chitiets });
                    report.regData('rptPhieuYeuCauGiaCong', null, dsPhieuYeuCauGiaCong);

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
                    this.objPhieuYeuCauGiaCongService.handleError(error);
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
