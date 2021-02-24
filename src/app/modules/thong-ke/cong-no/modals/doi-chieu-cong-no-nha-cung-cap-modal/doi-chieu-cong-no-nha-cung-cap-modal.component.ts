import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { User } from '@app/_models';
import { ThongKeCongNoNhaCungCap } from '@app/shared/entities';

@Component({
  selector: 'app-doi-chieu-cong-no-nha-cung-cap-modal',
  templateUrl: './doi-chieu-cong-no-nha-cung-cap-modal.component.html',
  styleUrls: ['./doi-chieu-cong-no-nha-cung-cap-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DoiChieuCongNoNhaCungCapModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;

    public mauin: number;
    public tungay: Date;
    public denngay: Date;
    public congnonhacungcap: ThongKeCongNoNhaCungCap;

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objThongKeCongNoService: ThongKeCongNoService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.nguoidungService.getCurrentUser().toPromise().then(rs => {
            this.currentUser = rs;
            this.onLoadData();
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeCongNoService.findsCongNo_NhaCungCap_DoiChieu(this.tungay, this.denngay, this.authenticationService.currentChiNhanhValue.id, this.congnonhacungcap.nhacungcap_id).subscribe(
                (data) => {
                    /* khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();
                    report.loadFile('assets/reports/design/cong-no/rptDoiChieuCongNo_Ncc.mrt');

                    /* xoá dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin chung phiếu in */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    /* thông tin công nợ */
                    let dsThongKeCongNo = new Stimulsoft.System.Data.DataSet();
                    this.congnonhacungcap.truoctungay = moment(this.tungay).subtract(1, "days").format('DD/MM/YYYY');
                    this.congnonhacungcap.tungay = moment(this.tungay).format('DD/MM/YYYY');
                    this.congnonhacungcap.denngay = moment(this.denngay).format('DD/MM/YYYY');

                    this.congnonhacungcap.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    this.congnonhacungcap.inphieu_hoten = this.currentUser.fullName;
                    this.congnonhacungcap.nocuoiky_bangchu = number2vn(this.congnonhacungcap.nocuoiky);
                    
                    dsThongKeCongNo.readJson({ rptThongKeCongNo: this.congnonhacungcap, rptThongKeCongNo_ChiTiet: data });
                    report.regData('rptThongKeCongNo', null, dsThongKeCongNo);

                    /* đổi logo phiếu in */
                    var imageLogo = Stimulsoft.System.Drawing.Image.fromFile(this.authenticationService.currentChiNhanhValue.logo_url);
                    report.dictionary.variables.getByName('LogoComapny').valueObject  = imageLogo;
                    
                    /* render report */
                    this.reportOptions.appearance.showTooltipsHelp = false;
                    this.reportOptions.toolbar.showOpenButton = false;
                    this.reportOptions.toolbar.showAboutButton = false;
                    this.reportOptions.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;
                    
                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
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
