import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { NguoiDungService, PhieuDatHangNCCService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { User } from '@app/_models';

@Component({
    selector: 'app-phieu-dat-hang-ncc-in-phieu-modal',
    templateUrl: './phieu-dat-hang-ncc-in-phieu-modal.component.html',
    styleUrls: ['./phieu-dat-hang-ncc-in-phieu-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PhieuDatHangNCCInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieudathangncc_id: number;

    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuDatHangNCCService: PhieuDatHangNCCService,
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
            this.objPhieuDatHangNCCService.findPhieuDatHangNCC(this.phieudathangncc_id).subscribe(
                (data) => {
                    /* khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();
                    report.loadFile('assets/reports/design/mua-hang/rptPhieuDatHangNCC.mrt');

                    /* xoá dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin chung phiếu in */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJsonFile('assets/reports/json/Info.json');
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuDatHangNCC = new Stimulsoft.System.Data.DataSet();
                    /* thông tin phiếu */
                    data.ngaylapphieu = moment(data.ngaydathangncc).format('HH:mm DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;
                    data.tongthanhtien_bangchu = number2vn(data.tongthanhtien);

                    data.tongtienthue = data.tongtienhang * data.thuevat;
                    /* thông tin chi tiết phiếu */
                    // if (data.chietkhau > 0) {
                    //     data.phieudathangncc_chitiet.forEach((item) => {
                    //         item.chietkhau = data.chietkhau;
                    //         item.thanhtien = item.soluong * item.dongia;
                    //         item.thanhtien = item.thanhtien - item.thanhtien * item.chietkhau + (item.thanhtien - item.thanhtien * item.chietkhau) * item.thuevat;
                    //     });
                    // }
                    // if (data.thuevat > 0) {
                    //     data.phieudathangncc_chitiet.forEach((item) => {
                    //         item.thuevat = data.thuevat;
                    //         item.thanhtien = item.soluong * item.dongia;
                    //         item.thanhtien = item.thanhtien - item.thanhtien * item.chietkhau + (item.thanhtien - item.thanhtien * item.chietkhau) * item.thuevat;
                    //     });
                    // }
                    dsPhieuDatHangNCC.readJson({ rptPhieuDatHangNCC: data, rptPhieuDatHangNCC_HangHoa: data.phieudathangncc_chitiet });
                    report.regData('rptPhieuDatHangNCC', null, dsPhieuDatHangNCC);

                    /* render report */
                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');
                },
                (error) => {
                    this.objPhieuDatHangNCCService.handleError(error);
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
