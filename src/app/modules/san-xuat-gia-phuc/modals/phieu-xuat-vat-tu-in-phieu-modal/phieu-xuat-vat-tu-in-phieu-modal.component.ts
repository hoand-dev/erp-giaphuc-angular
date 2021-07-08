import { Component, OnInit } from '@angular/core';
import { NguoiDungService, PhieuXuatVatTuService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;

@Component({
    selector: 'app-phieu-xuat-vat-tu-in-phieu-modal',
    templateUrl: './phieu-xuat-vat-tu-in-phieu-modal.component.html',
    styleUrls: ['./phieu-xuat-vat-tu-in-phieu-modal.component.css']
})
export class PhieuXuatVatTuInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieuxuatvattu_id: number;

    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuXuatVatTuService: PhieuXuatVatTuService,
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
            this.objPhieuXuatVatTuService.findPhieuXuatVatTu(this.phieuxuatvattu_id).subscribe(
                (data) => {
                    /* Khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();

                    report.loadFile('assets/reports/design/san-xuat/rptPhieuXuatVatTu.mrt');

                    /* Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin công ty */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    /*Thông tin chi chiết phiếu */
                    let dsPhieuXuatVatTu = new Stimulsoft.System.Data.DataSet();
                    data.ngaylapphieu = moment(data.ngayxuatvattu).format('DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;

                    dsPhieuXuatVatTu.readJson({ rptPhieuXuatVatTu: data, rptPhieuXuatVatTu_ChiTiet: data.phieuxuatvattu_chitiets });
                    report.regData('rptPhieuXuatVatTu', null, dsPhieuXuatVatTu);

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
                    this.objPhieuXuatVatTuService.handleError(error);
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
