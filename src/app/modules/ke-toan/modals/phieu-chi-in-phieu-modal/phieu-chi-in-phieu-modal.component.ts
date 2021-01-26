import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NguoiDungService, PhieuChiService } from '@app/shared/services';
import { User } from '@app/_models';
import { StringLengthRule } from 'devextreme/ui/validation_engine';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

declare var Stimulsoft: any;
import number2vn from 'number2vn';

@Component({
  selector: 'app-phieu-chi-in-phieu-modal',
  templateUrl: './phieu-chi-in-phieu-modal.component.html',
  styleUrls: ['./phieu-chi-in-phieu-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PhieuChiInPhieuModalComponent implements OnInit {
    public reportOptions: any = new Stimulsoft.Viewer.StiViewerOptions();
    public reportViewer: any = new Stimulsoft.Viewer.StiViewer(this.reportOptions, 'StiViewer', false);
    
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    private currentUser: User;
    public phieuchi_id: number;
    public loaiphieuchi: string;
    public loaiphieuin: string = 'vcb';

  constructor(
      public bsModalRef: BsModalRef,
      private nguoidungService: NguoiDungService,
      private objPhieuChiService: PhieuChiService,
      
  ) { }

  ngOnInit(): void {
      this.onClose = new Subject();
      this.nguoidungService.getCurrentUser().toPromise().then( rs =>{
        this.currentUser = rs;
        this.onLoadData();
      });
  }

  ngOnDestroy(): void{
      this.subscriptions.unsubscribe();
  }

  onLoadData(){
      this.subscriptions.add(
          this.objPhieuChiService.findPhieuChi(this.phieuchi_id).subscribe(
              (data) => {
                  /*khởi tạo report */
                  let report = new Stimulsoft.Report.StiReport();

                  /*Kiểm tra loại phiếu để lấy đúng mẫu report */
                   if(this.loaiphieuin =='vcb' ) {
                       report.loadFile('assets/reports/design/ke-toan/rptPhieuChi_VCB.mrt')
                   }
                   if(this.loaiphieuin =='scb'){
                    report.loadFile('assets/reports/design/ke-toan/rptPhieuChi_SCB.mrt')
                   }
                   if(this.loaiphieuin =='acb'){
                    report.loadFile('assets/reports/design/ke-toan/rptPhieuChi_ACB.mrt')
                   }
                    if(this.loaiphieuin =='c31'){
                    report.loadFile('assets/reports/design/ke-toan/rptPhieuChiC31.mrt')
                   }

                   /* xóa dữ liệu trước khi in*/
                   report.dictionary.databases.clear();

                   /*Thông tin in phiếu */

                   //let dsThongTin = new Stimulsoft.System.Data.DataSet();
                  // dsThongTin.readJsonFile('assets/reports/json/Info.json')
                  
                  /*Thông tin tin phiếu */
                 let dsPhieuChi = new Stimulsoft.System.Data.DataSet();

                 data.ngaylapphieu = moment(data.ngaychi).format('HH:mm DD/MM/YYYY');
                 data.phieuin_thoigian = moment().format('HH:mm DD/MM/YYYY');
                 data.phieuin_nguoiin = this.currentUser.fullName;
                 data.sotien_bangchu = number2vn(data.sotienchi);

                 dsPhieuChi.readJson({rptPhieuChi: data});
                 report.regData("rptPhieuChi", null, dsPhieuChi);

                 /* render sang report */
                 this.reportViewer.report =report;
                 this.reportViewer.renderHtml('viewerContent');

              },
              (error) =>{
                  this.objPhieuChiService.handleError(error);
              }
          ))
  }
  public onConfirm(): void{
      this.onClose.next(false);
      this.bsModalRef.hide();
  }

  public onCancel(): void{
      this.onClose.next(false);
      this.bsModalRef.hide();
  }

}
