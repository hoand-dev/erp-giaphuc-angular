import { ChiNhanh, NhomKhachHang } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { NhomKhachHangService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';


@Component({
  selector: 'app-nhom-khach-hang-them-moi',
  templateUrl: './nhom-khach-hang-them-moi.component.html',
  styleUrls: ['./nhom-khach-hang-them-moi.component.css']
})
export class NhomKhachHangThemMoiComponent implements OnInit {

  @ViewChild(DxFormComponent, {static: false}) frmNhomKhachHang: DxFormComponent;

  subscriptions: Subscription = new Subscription();
  public  nhomkhachhang: NhomKhachHang;

  private currentChiNhanh: ChiNhanh;
  public  saveProcessing = false;

  public  rules: Object = { 'X': /[02-9]/};
  public buttonSubmitOptions: any = {
    text: "Lưu lại",
    type: "success",
    useSubmitBehavior: true
  } 

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private nhomkhachhangService: NhomKhachHangService,
    private authenticationService: AuthenticationService
  ) { }

  ngAfterViewInit(){

  }

  ngOnInit(): void {
    setTimeout(() => {
        this.authenticationService.setDisableChiNhanh(true);
    });
    this.nhomkhachhang = new NhomKhachHang();
    this.theCallbackValid = this.theCallbackValid.bind(this);
    this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
  }

  ngOnDestroy(): void {
    this.authenticationService.setDisableChiNhanh(false);
    if(this.subscriptions){
      this.subscriptions.unsubscribe();
    }
  }

  theCallbackValid(params){
    return  this.nhomkhachhangService.checkExistNhomkhachHang(params.value);

  }

  onSubmitForm(e){
    if(!this.frmNhomKhachHang.instance.validate().isValid) return;
        
    let nhomkhachhang_req = this.nhomkhachhang;
    nhomkhachhang_req.chinhanh_id = this.currentChiNhanh.id;

    this.saveProcessing =true;
    this.subscriptions.add(this.nhomkhachhangService.addNhomKhachHang(nhomkhachhang_req).subscribe(
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
      ));
    e.preventDefault();
  }

}
