import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuNhapChuyenKhoService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

declare var Stimulsoft: any;

@Component({
    selector: 'app-phieu-nhap-chuyen-kho-in-phieu-modal',
    templateUrl: './phieu-nhap-chuyen-kho-in-phieu-modal.component.html',
    styleUrls: ['./phieu-nhap-chuyen-kho-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuNhapChuyenKhoInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieunhapchuyenkho_id: number;

    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuNhapChuyenKhoService: PhieuNhapChuyenKhoService,
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
            this.objPhieuNhapChuyenKhoService.findPhieuNhapChuyenKho(this.phieunhapchuyenkho_id).subscribe(
                (data) => {
                    /*Khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();
                    report.loadFile('assets/reports/design/kho-hang/rptPhieuNhapChuyenKho.mrt');

                    /* Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /* Thông tin phiếu */

                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJsonFile('assets/reports/json/Info.json');
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuNhapChuyenKho = new Stimulsoft.System.Data.DataSet();

                    /*Thông tin phiếu */

                    data.ngaylapphieu = moment(data.ngaynhapchuyenkho).format('HH:mm DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;

                    /* Tho6ng tin chi tiết phiếu in */
                    dsPhieuNhapChuyenKho.readJson({ rptPhieuNhapChuyenKho: data, rptPhieuNhapChuyenKho_ChiTiet: data.phieunhapchuyenkho_chitiets });
                    report.regData('rptPhieuNhapChuyenKho', null, dsPhieuNhapChuyenKho);

                    /* render report */
                    this.reportOptions.appearance.showTooltipsHelp = false;
                    this.reportOptions.toolbar.showOpenButton = false;
                    this.reportOptions.toolbar.showAboutButton = false;
                    this.reportOptions.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
                    
                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');
                },
                (error) => {
                    this.objPhieuNhapChuyenKhoService.handleError(error);
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
