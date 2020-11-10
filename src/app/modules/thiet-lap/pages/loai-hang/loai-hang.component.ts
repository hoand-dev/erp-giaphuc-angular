import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoaiHangService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';



@Component({
  selector: 'app-loai-hang',
  templateUrl: './loai-hang.component.html',
  styleUrls: ['./loai-hang.component.css']
})
export class LoaiHangComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  /* tối ưu subscriptions */

  subscriptions: Subscription = new Subscription();

  public stateStoringGrid = {
    enabled: true,
    type : "localStorage",
    storageKey : "dxGrid_LoaiHang"
  };

  constructor(
    private router: Router,
    private loaihangService: LoaiHangService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.onLoadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onLoadData() {
    this.subscriptions.add(this.loaihangService.findLoaiHangs().subscribe(
    data => {
      this.dataGrid.dataSource = data;
    },
    error =>{
      this.loaihangService.handleError(error);
    }
    ));
  }
  onRowDblClick(e){
    console.log(`loaihang_id: ${e.key.id}`);
  }

  onRowDelete(id){
    let result = confirm("<i>Bạn có muốn xóa loại hàng này?</i>", "Xác nhận xóa");
    result.then((dialogResult)=>{
      if(dialogResult){
        //gọi service xóa
        this.subscriptions.add(this.loaihangService.deleteLoaiHang(id).subscribe(
          data=>{
            if(data){
              notify({
                width: 320,
                message:"xóa thành công",
                position: { my: "right top", at: "right top"}
              }, "success" , 475);
            }
          
          this.onLoadData();
          },
          error=>{
            this.loaihangService.handleError(error);
            this.onLoadData();
          }
          ));
      }
    });
  }

}