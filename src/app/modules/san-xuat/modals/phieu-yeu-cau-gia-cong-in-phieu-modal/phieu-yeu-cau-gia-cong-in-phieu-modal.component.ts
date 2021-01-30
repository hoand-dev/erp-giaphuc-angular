import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuYeuCauGiaCongService } from '@app/shared/services';
import { User } from '@app/_models';
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

    private currentUser: User;
    public phieuyeucaugiacong_id: number;
    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuYeuCauGiaCongService: PhieuYeuCauGiaCongService) {}

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

                    report.loadFile('assets/reports/design/san-xuat/rptPhieuYeuCauGiaCong.mrt');

                    /* Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin công ty */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJsonFile('assets/reports/json/Info.json');
                    report.regData('Info', null, dsThongTin);

                    /*Thông tin chi chiết phiếu */
                    let dsPhieuYeuCauGiaCong = new Stimulsoft.System.Data.DataSet();
                    data.ngaylapphieu = moment(data.ngayyeucaugiacong).format('HH:mm DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;

                    dsPhieuYeuCauGiaCong.readJson({ rptPhieuYeuCauGiaCong: data, rptPhieuYeuCauGiaCong_ChiTiet: data.phieuyeucaugiacong_chitiets });
                    report.regData('rptPhieuYeuCauGiaCong', null, dsPhieuYeuCauGiaCong);

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
