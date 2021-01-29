import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuXuatKhoGiaCongService } from '@app/shared/services';
import { User } from '@app/_models';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;

@Component({
    selector: 'app-phieu-xuat-kho-gia-cong-in-phieu-modal',
    templateUrl: './phieu-xuat-kho-gia-cong-in-phieu-modal.component.html',
    styleUrls: ['./phieu-xuat-kho-gia-cong-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuXuatKhoGiaCongInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieuxuatkhogiacong_id: number;

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuXuatKhoGiaCongService: PhieuXuatKhoGiaCongService) {}

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
            this.objPhieuXuatKhoGiaCongService.findPhieuXuatKhoGiaCong(this.phieuxuatkhogiacong_id).subscribe(
                (data) => {
                    /* Khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();

                    report.loadFile('assets/reports/design/san-xuat/rptPhieuXuatGiaCong.mrt');

                    /*Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin phiếu  */

                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJsonFile('assets/reports/json/Info.json');
                    report.regData('Info', null, dsThongTin);

                    /*Thông tin chi tiết */
                    let dsPhieuXuatKhoGiaCong = new Stimulsoft.System.Data.DataSet();

                    data.ngaylapphieu = moment(data.ngayxuatkhogiacong).format('HH:mm DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;

                    /*Thông tin chi tiết */
                    dsPhieuXuatKhoGiaCong.readJson({ rptPhieuXuatKhoGiaCong: data, rptPhieuXuatKhoGiaCong_ChiTiet: data.phieuxuatkhogiacong_chitiets });
                    report.regData('rptPhieuXuatKhoGiaCong', null, dsPhieuXuatKhoGiaCong);

                    /* render sang report */

                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');

                    /*Remove the print to Pdf and Print with preview */
                    this.reportViewer.jsObject.controls.menus.printMenu.items['PrintPdf'].style.display = 'none';
                    this.reportViewer.jsObject.controls.menus.printMenu.items['PrintWithPreview'].style.display = 'none';
                },
                (error) => {
                    this.objPhieuXuatKhoGiaCongService.handleError(error);
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
