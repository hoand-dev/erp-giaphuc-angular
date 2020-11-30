import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BangGiaService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';


@Component({
  selector: 'app-bang-gia',
  templateUrl: './bang-gia.component.html',
  styleUrls: ['./bang-gia.component.css']
})
export class BangGiaComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscription */

    private subscriptions: Subscription = new Subscription();

    /* Khai báo thời gian bắt đầu và kết thúc */

    public firstDayTime: Date;
    public currDayTime : Date = new Date();

    public stateStoringGrid = {
        enable: true,
        type: 'localStorage',
        storageKey: ' dxGrid_BangGia'
    };


  constructor(
    private router: Router,
    private objBangGiaService: BangGiaService,
    private authenticationService: AuthenticationService

  ) { }

  ngOnInit(): void {
      this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
      this.currDayTime = moment().add(1, 'days').toDate();
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
      this.subscriptions.add(this.objBangGiaService.findBangGias(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime,).subscribe(
          data =>{
              this.dataGrid.dataSource = data; 
          },
          error => {
              this.objBangGiaService.handleError(error);
          }
        )
    );
  }

  onRowDblClick(e){
      console.log(`objBangGia_id: ${e.key.id}`);
  }

  onRowDelete(id){
      let result = confirm('<i>Bạn có muốn xóa phiếu này ? </i>', 'xác nhận xóa');
      result.then((dialogResult) =>{
        // gọi service xóa
        this.subscriptions.add(
            this.objBangGiaService.deleteBangGia(id).subscribe(
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
                    this.objBangGiaService.handleError(error);
                    // load lại dữ liệu
                    this.onLoadData();
                }
            )
        );
    }
      )
  }

}
