import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuThuService } from '@app/shared/services';
import { User } from '@app/_models';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { Subscription, Subject } from 'rxjs';

@Component({
    selector: 'app-phieu-thu-in-phieu',
    templateUrl: './phieu-thu-in-phieu.component.html',
    styleUrls: ['./phieu-thu-in-phieu.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuThuInPhieuComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieuthu_id: number;

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuThuService: PhieuThuService) {}

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
            this.objPhieuThuService.findPhieuThu(this.phieuthu_id).subscribe(
                (data) => {
                    /*Khởi tạo reprot */
                    let report = new Stimulsoft.Report.StiReport();

                    report.loadFile('assets/reports/design/ke-toan/rptPhieuThuC31.mrt');
                    /* Xóa dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin phiếu */

                    let dsPhieuThu = new Stimulsoft.System.Data.DataSet();

                    data.ngaylapphieu = moment(data.ngaythu).format('HH:mm DD/MM/YYYY');
                    data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.phieuin_nguoiin = this.currentUser.fullName;
                    data.sotien_bangchu = number2vn(data.sotienthu);

                    dsPhieuThu.readJson({ rptPhieuThu: data });
                    report.regData('rptPhieuThu', null, dsPhieuThu);

                    /* render sang report */
                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');

                    /*Remove the print to Pdf and Print with preview */
                    this.reportViewer.jsObject.controls.menus.printMenu.items['PrintPdf'].style.display = 'none';
                    this.reportViewer.jsObject.controls.menus.printMenu.items['PrintWithPreview'].style.display = 'none';
                },
                (error) => {
                    this.objPhieuThuService.handleError(error);
                }
            )
        );
    }

    public onConfirm(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
