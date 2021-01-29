import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { NguoiDungService, PhieuXuatTraMuonHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';
import { User } from '@app/_models';

@Component({
    selector: 'app-phieu-xuat-tra-muon-hang-in-phieu-modal',
    templateUrl: './phieu-xuat-tra-muon-hang-in-phieu-modal.component.html',
    styleUrls: ['./phieu-xuat-tra-muon-hang-in-phieu-modal.component.css']
  })
  export class PhieuXuatTraMuonHangInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieuxuattramuonhang_id: number;

    constructor(public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuXuatTraMuonHangService: PhieuXuatTraMuonHangService, private authenticationService: AuthenticationService) {}

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
            this.objPhieuXuatTraMuonHangService.findPhieuXuatTraMuonHang(this.phieuxuattramuonhang_id).subscribe(
                (data) => {
                    /* khởi tạo report */
                    let report = new Stimulsoft.Report.StiReport();

                    /* kiểm tra loại phiếu để lấy đúng mẫu report */
                    report.loadFile('assets/reports/design/kho-hang/rptPhieuXuatTraMuonHang.mrt');

                    /* xoá dữ liệu trước khi in */
                    report.dictionary.databases.clear();

                    /* thông tin chung phiếu in */
                    let dsThongTin = new Stimulsoft.System.Data.DataSet();
                    dsThongTin.readJsonFile('assets/reports/json/Info.json');
                    report.regData('Info', null, dsThongTin);

                    let dsPhieuXuatTraMuonHang = new Stimulsoft.System.Data.DataSet();
                    /* thông tin phiếu */
                    data.ngaylapphieu = moment(data.ngayxuattramuonhang).format('HH:mm DD/MM/YYYY');
                    data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                    data.inphieu_hoten = this.currentUser.fullName;
                    //data.tongthanhtien_bangchu = number2vn(data.tongthanhtien);
                    
                    dsPhieuXuatTraMuonHang.readJson({ rptThongTinPhieu: data, rptThongTinHangHoa: data.phieuxuattramuonhang_chitiets });
                    report.regData('rptPhieuXuatTraMuonHang', null, dsPhieuXuatTraMuonHang);

                    /* render report */
                    this.reportViewer.report = report;
                    this.reportViewer.renderHtml('viewerContent');
                },
                (error) => {
                    this.objPhieuXuatTraMuonHangService.handleError(error);
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