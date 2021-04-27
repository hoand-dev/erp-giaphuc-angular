import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, ThongKeThuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { User } from '@app/_models';

@Component({
    selector: 'app-thong-ke-thu-chi-ton-quy-tong-hop-modal',
    templateUrl: './thong-ke-thu-chi-ton-quy-tong-hop-modal.component.html',
    styleUrls: ['./thong-ke-thu-chi-ton-quy-tong-hop-modal.component.css']
})
export class ThongKeThuChiTonQuyTongHopModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;

    public tungay: Date;
    public denngay: Date;
    public chinhanh_id: number;
    public quy_ids: string;

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private thongkethuchiService: ThongKeThuChiService, private authenticationService: AuthenticationService) {}

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
        // this.subscriptions.add(
        //     this.thongkethuchiService.findsThuChi_TonQuy().subscribe(
        //         (data) => {
                    
        //         },
        //         (error) => {
        //             this.thongkethuchiService.handleError(error);
        //         }
        //     )
        // );
        this.thongkethuchiService.findsThuChi_TonQuy(this.tungay, this.denngay, this.chinhanh_id, this.quy_ids)
            .toPromise()
            .then((rs) => {
                return rs;
            })
            .then((data)=>{
                this.thongkethuchiService.findsThuChi_TonQuy_ChiTiet(this.tungay, this.denngay, this.chinhanh_id, this.quy_ids).toPromise()
                .then((dataChiTiet)=>{
                    /* khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();

                    report.loadFile('assets/reports/design/thong-ke/rptThong-ke-thu-chi-ton-quy.mrt');

                    /* xoá dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin chung phiếu in */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();

                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    let dsThongKe = new Stimulsoft.System.Data.DataSet();

                    dsThongKe.readJson({ rptThongKeTonQuy: data, rptThongKeTonQuy_ChiTiet: dataChiTiet });
                    report.regData('ThongKe', null, dsThongKe);

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
                })
            })
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
