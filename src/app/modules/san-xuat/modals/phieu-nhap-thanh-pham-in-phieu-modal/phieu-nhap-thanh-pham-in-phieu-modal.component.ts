import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuNhapKhoGiaCongService } from '@app/shared/services';
import { User } from '@app/_models';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

declare var Stimulsoft: any;

@Component({
  selector: 'app-phieu-nhap-thanh-pham-in-phieu-modal',
  templateUrl: './phieu-nhap-thanh-pham-in-phieu-modal.component.html',
  styleUrls: ['./phieu-nhap-thanh-pham-in-phieu-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PhieuNhapThanhPhamInPhieuModalComponent implements OnInit {
    public reportOptions: any  = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions,'StiViewer', false);

    private subscription: Subscription = new Subscription();
    private onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieunhapkhogiacong_id: number;

  constructor(
    public bsModalRef: BsModalRef, private nguoidungService: NguoiDungService, private objPhieuNhapKhoGiaCong: PhieuNhapKhoGiaCongService
  ) { }

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

  ngOnDestroy(): void{
      this.subscription.unsubscribe();
  }

  onLoadData(){

this.subscription.add(
          this.objPhieuNhapKhoGiaCong.findPhieuNhapKhoGiaCong(this.phieunhapkhogiacong_id).subscribe(
              (data) => {
                  /* Khởi tạo report */
                  let report = new Stimulsoft.Report.StiReport();

                  report.loadFile('assets/reports/design/san-xuat/rptPhieuNhapThanhPham.mrt');

                  /* Xóa dữ liệu trên cache trước khi in */
                  report.dictionary.databases.clear();

                  /*Thông tin công ty */
                  let dsThongTin = new Stimulsoft.System.Data.DataSet();
                  dsThongTin.readJsonFile('assets/reports/json/Info.json');
                  report.regData('Info', null, dsThongTin);

                  /*Thông tin chi chiết phiếu */
                  let dsPhieuNhapThanhPham = new Stimulsoft.System.Data.DataSet();
                  data.ngaylapphieu = moment(data.ngaynhapkhogiacong).format('HH:mm DD/MM/YYYY');
                  data.inphieu_thoigian = moment().format('HH:mm DD/MM/YYYY');
                  data.inphieu_hoten = this.currentUser.fullName;

                  dsPhieuNhapThanhPham.readJson({rptPhieuNhapThanhPham: data, rptPhieuNhapThanhPham_ChiTiet: data.phieunhapkhogiacong_chitiets});
                  report.regData('rptPhieuNhapThanhPham', null, dsPhieuNhapThanhPham);

                  /*Render sang html */
                  this.reportViewer.report = report;
                  this.reportViewer.renderHtml('viewerContent');
                  this.reportViewer.jsObject.controls.menus.printMenu.items["PrintPdf"].style.display = "none";
                  this.reportViewer.jsObject.controls.menus.printMenu.items["PrintWithPreview"].style.display = "none";


              },
              (error)=>{
                  this.objPhieuNhapKhoGiaCong.handleError(error);
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
