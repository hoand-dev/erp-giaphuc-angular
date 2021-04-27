import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PhieuBanHang, PhieuCanTru } from '@app/shared/entities';
import { LenhVayService, NguoiDungService, PhieuBanHangService, PhieuCanTruService, PhieuChiService, PhieuThuService, ThongKeThuChiService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import { StringLengthRule } from 'devextreme/ui/validation_engine';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';

@Component({
  selector: 'app-thong-ke-ton-quy-chi-tiet-in-phieu-modal',
  templateUrl: './thong-ke-ton-quy-chi-tiet-in-phieu-modal.component.html',
  styleUrls: ['./thong-ke-ton-quy-chi-tiet-in-phieu-modal.component.css']
})
export class ThongKeTonQuyChiTietInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public quy_id: number;
    public loaiphieu: string;


    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuChiService: PhieuChiService, private objPhieuThuService: PhieuThuService, objPhieuCanTru: PhieuCanTruService, objLenhVay: LenhVayService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.nguoidungService
            .getCurrentUser()
            .toPromise()
            .then((rs) => {
                this.currentUser = rs;
               // this.onLoadData();
            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // onLoadData() {
    //     this.subscription.add(
    //         this.objPhieuBanHangService.findPhieuBanHang(this.phieubanhang_id).subscribe(
    //             (data) => {
    //                 /*khởi tạo report */
    //                 let report = new Stimulsoft.Report.StiReport();

    //                 report.loadFile('assets/reports/design/ban-hang/rptPhieuYeuCauXuatKho_DonGiaVAT.mrt');
            
    //                 /*xóa dữ liệu trên cache trước khi in */
    //                 report.dictionary.databases.clear();

    //                 /* Thông tin chung in phiếu */
    //                 let dsThongTin = new Stimulsoft.System.Data.DataSet();
    //                 dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
    //                 report.regData('Info', null, dsThongTin);

    //                 let dsPhieuBanHang = new Stimulsoft.System.Data.DataSet();

                 
    //                 });

    //                 dsPhieuBanHang.readJson({ rptPhieuYeuCauXuatKho: data, rptPhieuYeuCauXuatKho_ChiTiet: data.phieubanhang_chitiet });
    //                 report.regData('rptPhieuYeuCauXuatKho', null, dsPhieuBanHang);

    //                 /* đổi logo phiếu in */
    //                 var imageLogo = Stimulsoft.System.Drawing.Image.fromFile(this.authenticationService.currentChiNhanhValue.logo_url);
    //                 report.dictionary.variables.getByName('LogoComapny').valueObject = imageLogo;

    //                 /* render report */
    //                 this.reportOptions.appearance.showTooltipsHelp = false;
    //                 this.reportOptions.toolbar.showOpenButton = false;
    //                 this.reportOptions.toolbar.showAboutButton = false;
    //                 this.reportOptions.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Direct;

    //                 this.reportViewer.report = report;
    //                 this.reportViewer.renderHtml('viewerContent');
    //             },
    //             (error) => {
    //                 this.objPhieuBanHangService.handleError(error);
    //             }
            
    //     )
    

    // public onConfirm(): void {
    //     this.onClose.next(true);
    //     this.bsModalRef.hide();
    // }

    // public onCancel(): void {
    //     this.onClose.next(false);
    //     this.bsModalRef.hide();
    // }
}
