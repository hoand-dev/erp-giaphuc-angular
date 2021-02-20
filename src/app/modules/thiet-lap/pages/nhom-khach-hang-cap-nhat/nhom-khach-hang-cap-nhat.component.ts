
import { NhomKhachHangService } from './../../../../shared/services/thiet-lap/nhom-khach-hang.service';
import { NhomKhachHang } from './../../../../shared/entities/thiet-lap/nhom-khach-hang';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-nhom-khach-hang-cap-nhat',
  templateUrl: './nhom-khach-hang-cap-nhat.component.html',
  styleUrls: ['./nhom-khach-hang-cap-nhat.component.css']
})
export class NhomKhachHangCapNhatComponent implements OnInit {

  @ViewChild(DxFormComponent, { static: false }) frmNhomKhachHangCapNhatComponent: DxFormComponent;

  /* tối ưu subscrips */
  
  subscriptions: Subscription = new Subscription();

  public nhomkhachhang: NhomKhachHang;
  public  manhomkhachhang_old: string;
  public saveProcessing = false;


  public  rules: Object = {'X': /[02-9]/};
  public buttonSubmitOptions: any ={
    text: "Lưu Lại",
    type: "success",
    useSubmitBehavior: true
  }
  
  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private nhomkhachhangService: NhomKhachHangService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.authenticationService.setDisableChiNhanh(true);
    });
    this.nhomkhachhang = new NhomKhachHang();
    this.theCallbackValid = this.theCallbackValid.bind(this);//biding sang html
    this.subscriptions.add(this.activatedRouter.params.subscribe(params => {
    let nhomkhachhang_id = params.id;

    //lấy thông tin nhóm khách hàng
    if(nhomkhachhang_id){
      this.subscriptions.add(this.nhomkhachhangService.findNhomKhachHang(nhomkhachhang_id).subscribe(
        data => {
          this.nhomkhachhang = data[0];
          this.manhomkhachhang_old = this.nhomkhachhang.manhomkhachhang;
        },
        error =>{
          this.nhomkhachhangService.handleError(error);
        }
      ));
    }  
    }));
  }

  ngOnDestroy(): void {
    this.authenticationService.setDisableChiNhanh(false);
    this.subscriptions.unsubscribe();
  }

  theCallbackValid(params){
    return  this.nhomkhachhangService.checkExistNhomkhachHang(params.value, this.manhomkhachhang_old);
  }

  onSubmitForm(e){
    let nhomkhachhang_req = this.nhomkhachhang;

    this.saveProcessing = true;
    this.subscriptions.add(this.nhomkhachhangService.updateNhomKhachHang(nhomkhachhang_req).subscribe(
      data => {
        notify({
            width: 320,
            message: "Lưu thành công",
            position: { my: "right top", at: "right top"}
          }, "success", 475);
        this.router.navigate(['/nhom-khach-hang']);
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
