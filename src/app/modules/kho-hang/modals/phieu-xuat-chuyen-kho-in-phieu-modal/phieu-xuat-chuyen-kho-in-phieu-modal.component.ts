import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuXuatChuyenKhoService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

declare var Stimulsoft: any;
import { Subscription, Subject } from 'rxjs';

@Component({
    selector: 'app-phieu-xuat-chuyen-kho-in-phieu-modal',
    templateUrl: './phieu-xuat-chuyen-kho-in-phieu-modal.component.html',
    styleUrls: ['./phieu-xuat-chuyen-kho-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuXuatChuyenKhoInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieuxuatchuyenkho_id: number;

    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuXuatChuyenKhoService: PhieuXuatChuyenKhoService,
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
            this.objPhieuXuatChuyenKhoService.findPhieuXuatChuyenKho(this.phieuxuatchuyenkho_id).subscribe(
                (data) => {
                    /*khởi tạo report*/
                    let report = new Stimulsoft.Report.StiReport();
                    report.loadFile('assets/reports/design/kho-hang/rptPhieuXuatChuyenKho.mrt');

                    /*Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin in phiếu */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuXuatChuyenkho = new Stimulsoft.System.Data.DataSet();
                    /*Thông tin phiếu */

                    data.ngaylapphieu = moment(data.ngayxuatchuyenkho).format('DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;

                    dsPhieuXuatChuyenkho.readJson({ rptPhieuXuatChuyenKho: data, rptPhieuXuatChuyenKho_ChiTiet: data.phieuxuatchuyenkho_chitiets });
                    report.regData('rptPhieuXuatChuyenKho', null, dsPhieuXuatChuyenkho);

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
                    this.objPhieuXuatChuyenKhoService.handleError(error);
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
