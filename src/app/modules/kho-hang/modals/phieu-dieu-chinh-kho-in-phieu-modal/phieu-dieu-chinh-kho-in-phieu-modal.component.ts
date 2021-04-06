import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { User } from '@app/_models';
import { PhieuDieuChinhKho } from '@app/shared/entities';
import { NguoiDungService, PhieuDieuChinhKhoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

@Component({
    selector: 'app-phieu-dieu-chinh-kho-in-phieu-modal',
    templateUrl: './phieu-dieu-chinh-kho-in-phieu-modal.component.html',
    styleUrls: ['./phieu-dieu-chinh-kho-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuDieuChinhKhoInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieudieuchinhkho_id: number;

    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuDieuChinhKhoService: PhieuDieuChinhKhoService,
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
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuDieuChinhKhoService.findPhieuDieuChinhKho(this.phieudieuchinhkho_id).subscribe(
                (data) => {
                    /*khởi tạo report*/
                    let report = new Stimulsoft.Report.StiReport();
                    report.loadFile('assets/reports/design/kho-hang/rptPhieuDieuChinhKho.mrt');

                    /*Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin in phiếu */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuDieuChinhKho = new Stimulsoft.System.Data.DataSet();
                    /*Thông tin phiếu */

                    data.ngaylapphieu = moment(data.ngaydieuchinhkho).format('DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;

                    dsPhieuDieuChinhKho.readJson({ rptPhieuDieuChinhKho: data, rptPhieuDieuChinhKho_ChiTiet: data.phieudieuchinhkho_chitiets });
                    report.regData('rptPhieuDieuChinhKho', null, dsPhieuDieuChinhKho);

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
                    this.objPhieuDieuChinhKhoService.handleError(error);
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
