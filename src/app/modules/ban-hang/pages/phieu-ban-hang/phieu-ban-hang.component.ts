import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuBanHang } from '@app/shared/entities';
import { PhieuBanHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Subscription, Subject } from 'rxjs';
import { PhieuBanHangInPhieuComponent } from '../../modals/phieu-ban-hang-in-phieu/phieu-ban-hang-in-phieu.component';

@Component({
  selector: 'app-phieu-ban-hang',
  templateUrl: './phieu-ban-hang.component.html',
  styleUrls: ['./phieu-ban-hang.component.css']
})
export class PhieuBanHangComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscription */

    private subscriptions: Subscription = new Subscription();

    /* Khai báo thời gian bắt đầu và kết thúc */

    public firstDayTime: Date;
    public currDayTime : Date = new Date();
    public timeCreateAt: Date = new Date();
    public bsModalRef: BsModalRef;

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: ' dxGrid_PhieuBanHang'
    };


  constructor(
    private router: Router,
    private objPhieuBanHangService: PhieuBanHangService,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {
      this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
      this.currDayTime = moment().add(1, 'days').toDate();
      this.timeCreateAt = moment().add(1, 'days').toDate();
  }

  ngAfterViewInit(): void{

    this.subscriptions.add(
        this.authenticationService.currentChiNhanh.subscribe(
            (x) =>{
                this.onLoadData();
            }
        )
        );
  }

  ngOnDestroy(): void{
      this.subscriptions.unsubscribe();
  }

  onLoadData(){
      this.subscriptions.add(this.objPhieuBanHangService.findPhieuBanHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
          data =>{
              this.dataGrid.dataSource = data; 
          },
          error => {
              this.objPhieuBanHangService.handleError(error);
          }
        )
    );
  }

  addMenuItems(e){
      if(e.row.rowType ==='data'){
          if(!e.items) e.items =[];

          e.items.push(
              {
                  text: 'In phiếu',
                  icon: 'print',
                  visible: 'true',

                  onItemClick:() =>{
                      let rowData: PhieuBanHang = e.row.key as PhieuBanHang;

                      /*Khởi tạo giá trị modal */
                      const initialState ={
                          title: "IN PHIẾU YÊU CẦU XUẤT KHO",
                          phieubanhang_id: rowData.id,
                          
                      };
                      /* Hiển thị modal */
                      this.bsModalRef = this.modalService.show(PhieuBanHangInPhieuComponent,{
                          class: 'modal-xl modal-dialog-centered',
                          ignoreBackdropClick: false,
                          keyboard: false,
                          initialState
                      });
                      this.bsModalRef.content.closeBtnName =" Đóng"
                  }
              }
          );
         
      }
  }

  onRowDblClick(e){
      console.log(`objPhieuBanHang_id: ${e.key.id}`);
  }

  onRowDelete(id){
      let result = confirm('<i>Bạn có muốn xóa phiếu này ? </i>', 'xác nhận xóa');
      result.then((dialogResult) =>{
        // gọi service xóa
        this.subscriptions.add(
            this.objPhieuBanHangService.deletePhieuBanHang(id).subscribe(
                (data) => {
                    if (data) {
                        notify(
                            {
                                width: 320,
                                message: 'Xóa thành công',
                                position: { my: 'right top', at: 'right top' }
                            },
                            'success',
                            475
                        );
                    }
                    // load lại dữ liệu
                    this.onLoadData();
                },
                (error) => {
                    this.objPhieuBanHangService.handleError(error);
                    // load lại dữ liệu
                    this.onLoadData();
                }
            )
        );
    }
      )
  }

}
