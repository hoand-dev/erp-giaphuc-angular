import { ActivatedRoute, Router } from '@angular/router';

import { DxFormComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NhomKhachHang } from '@app/shared/entities';
import { NhomKhachHangService } from '@app/shared/services';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-nhom-khach-hang-them-moi',
  templateUrl: './nhom-khach-hang-them-moi.component.html',
  styleUrls: ['./nhom-khach-hang-them-moi.component.css']
})
export class NhomKhachHangThemMoiComponent implements OnInit {

  @ViewChild(DxFormComponent, {static: false}) frmNhomKhachHang: DxFormComponent;

  private subscription: Subscription;
  public  nhomkhachhang: NhomKhachHang;

  public  saveProcessing = false;

  public  rules: Object = { 'X': /[02-9]/};
  public buttonSubmitOptions: any = {
    text: "Lưu lại",
    type: "success",
    useSubmitBehavior: true
  } 

  constructor(
    private router: Router,
    private  activatedRoute: ActivatedRoute,
    private nhomkhachhangService: NhomKhachHangService
  ) { }

  ngAfterViewInit(){

  }

  ngOnInit(): void {
    this.nhomkhachhang = new NhomKhachHang();
    this.theCallbackValid = this.theCallbackValid.bind(this);
  }
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  theCallbackValid(params){
    return  this.nhomkhachhangService.checkExistNhomkhachHang(params.value);

  }

  onSubmitForm(e){
    let nhomkhachhang_req = this.nhomkhachhang;

    this.saveProcessing =true;
    this.subscription = this.nhomkhachhangService.addNhomKhachHang(nhomkhachhang_req).subscribe(
      data => {
        notify({
          width: 320,
          message: "Lưu thành công",
          position: { my: "right top", at: "right top"}
        }, "sucess", 475);
        this.router.navigate(['/nhom-khach-hang']); // chuyển trang sau khi thêm
        this.frmNhomKhachHang.instance.resetValues();
        this.saveProcessing = false;
      },
      error => {
        this.nhomkhachhangService.handleError(error);
        this.saveProcessing = false;
      }
    );
    e.preventDefault();
  }

}
