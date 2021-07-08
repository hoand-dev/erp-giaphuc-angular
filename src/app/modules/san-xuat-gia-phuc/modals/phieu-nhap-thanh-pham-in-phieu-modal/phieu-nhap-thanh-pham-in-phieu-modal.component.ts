import { Component, OnInit } from '@angular/core';
import { NguoiDungService, PhieuNhapThanhPhamService } from '@app/shared/services';
import { User } from '@app/_models';
import { AuthenticationService } from '@app/_services';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;

@Component({
  selector: 'app-phieu-nhap-thanh-pham-in-phieu-modal',
  templateUrl: './phieu-nhap-thanh-pham-in-phieu-modal.component.html',
  styleUrls: ['./phieu-nhap-thanh-pham-in-phieu-modal.component.css']
})
export class PhieuNhapThanhPhamInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscription: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public loaiphieuin: string = 'temkien';

    private currentUser: User;
    public phieunhapthanhpham_id: number;

    constructor(
        public bsModalRef: BsModalRef,
        private nguoidungService: NguoiDungService,
        private objPhieuNhapThanhPham: PhieuNhapThanhPhamService,
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
        this.subscription.unsubscribe();
    }

    onLoadData() {
        this.subscription.add(
            this.objPhieuNhapThanhPham.findPhieuNhapThanhPham(this.phieunhapthanhpham_id).subscribe(
                (data) => {
                    /* Khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();
                    if(this.loaiphieuin == 'temkien'){
                        report.loadFile('assets/reports/design/san-xuat/rptTemKien.mrt');
                    }
                    if(this.loaiphieuin == 'nhapthanhpham'){
                        report.loadFile('assets/reports/design/san-xuat/rptPhieuNhapThanhPham_GP.mrt');
                    }

                    /* Xóa dữ liệu trên cache trước khi in */
                    report.dictionary.databases.clear();

                    /*Thông tin công ty */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJson({ Info: this.authenticationService.currentChiNhanhValue });
                    report.regData('Info', null, dsThongTin);

                    /*Thông tin chi chiết phiếu */
                    let dsPhieuNhapThanhPham = new Stimulsoft.System.Data.DataSet();
                    data.ngaylapphieu = moment(data.ngaynhapthanhpham).format('DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;

                    dsPhieuNhapThanhPham.readJson({ rptPhieuNhapThanhPham: data, rptPhieuNhapThanhPham_Chitiet: data.phieunhapthanhpham_chitiets });
                    report.regData('rptPhieuNhapThanhPham', null, dsPhieuNhapThanhPham);

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
                    this.objPhieuNhapThanhPham.handleError(error);
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
