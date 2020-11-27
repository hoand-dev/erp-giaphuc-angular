import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuBanHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-danh-sach-phieu-ban-hang-modal',
  templateUrl: './danh-sach-phieu-ban-hang-modal.component.html',
  styleUrls: ['./danh-sach-phieu-ban-hang-modal.component.css']
})
export class DanhSachPhieuBanHangModalComponent implements OnInit {

    public subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* Khai báo thời gian bắt đầu và kết thúc */

    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    @ViewChild(DxDataGridComponent) dataGrird: DxDataGridComponent;
    public stateStoringGrid = {
        enable: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalPhieuBanHang'
    };

    
  constructor(
      public bsModalRef: BsModalRef,
      private objPhieuBanHangService: PhieuBanHangService,
      private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
      this.onClose = new Subject();

    /*khởi tạo thời gian bắt đầu và kế htu1c */
    this.firstDayTime = new Date(moment().get('year'),moment().get('month'),1);
    this.currDayTime = moment().toDate();

    this.subscriptions.add(
        this.authenticationService.currentChiNhanh.subscribe(x => {this.onLoadData();
        })
    )
  }

  ngOnDestroy(): void{
      this.subscriptions.unsubscribe();
  }

  onLoadData(){
      this.subscriptions.add(this.objPhieuBanHangService.findPhieuBanHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
          data => {
              this.dataGrird.dataSource = data;
          },
          (error) => {
              this.objPhieuBanHangService.handleError(error);
          }
      ));
  }
  onRowDblClick(e){
      this.onConFirm(e.key);
  }

  public onConFirm(item): void{
      this.onClose.next(item);
      this.bsModalRef.hide();
  }

  public onCancel(): void{
      this.onClose.next(false);
      this.bsModalRef.hide();
  }

}