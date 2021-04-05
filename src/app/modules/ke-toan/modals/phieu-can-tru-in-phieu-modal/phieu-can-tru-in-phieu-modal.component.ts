import { Component, OnInit } from '@angular/core';
import { NguoiDungService, PhieuCanTruService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { Subscription, Subject } from 'rxjs';

@Component({
    selector: 'app-phieu-can-tru-in-phieu-modal',
    templateUrl: './phieu-can-tru-in-phieu-modal.component.html',
    styleUrls: ['./phieu-can-tru-in-phieu-modal.component.css']
})
export class PhieuCanTruInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieucantru_id: number;
    public loaicantru: string;
    public loaiphieuin: string = 'khncc';

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuCanTruService: PhieuCanTruService, private authenticationService: AuthenticationService) {}

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
            this.objPhieuCanTruService.findPhieuCanTru(this.phieucantru_id).subscribe(
                (data) => {
                    /*Khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();

                    /* Kiểm tra loại phiếu để lấy đúng report */
                    if (this.loaiphieuin == 'khncc') {
                        report.loadFile('assets/reports/design/ke-toan/rptPhieuCanTruKH_NCC.mrt');
                    }
                    if (this.loaiphieuin == 'khdvgc') {
                        report.loadFile('assets/reports/design/ke-toan/rptPhieuCanTruKH_DVGC.mrt');
                    }

                    /* xoá dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin chung phiếu in */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuCanTru = new Stimulsoft.System.Data.DataSet();

                    /* thông tin phiếu */
                    data.ngaylapphieu = moment(data.ngaycantru).format('DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;
                    data.sotien_bangchu = number2vn(data.sotiencantru);

                    dsPhieuCanTru.readJson({ rptPhieuCanTru: data });
                    report.regData('rptPhieuCanTru', null, dsPhieuCanTru);

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
                    this.objPhieuCanTruService.handleError(error);
                }
            )
        );
    }
}
