
import { NhomNhaCungCap } from './../../../../shared/entities/thiet-lap/nhom-nha-cung-cap';
import { NhomNhaCungCapService } from './../../../../shared/services/thiet-lap/nhom-nha-cung-cap.service';
import { DxFormComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { AuthenticationService } from '@app/_services';
import { ChiNhanh } from '@app/shared/entities';

@Component({
  selector: 'app-nhom-nha-cung-cap-cap-nhat',
  templateUrl: './nhom-nha-cung-cap-cap-nhat.component.html',
  styleUrls: ['./nhom-nha-cung-cap-cap-nhat.component.css']
})
export class NhomNhaCungCapCapNhatComponent implements OnInit {

  @ViewChild(DxFormComponent, {static: false}) frmNhomNhaCungCapCapNhatComponent: DxFormComponent;

  /*tối ưu subscriptions */

  subscriptions: Subscription = new Subscription();
  private currentChiNhanh: ChiNhanh;

  public nhomnhacungcap: NhomNhaCungCap;
  public  saveProcessing = false;
  public  manhomnhacungcap_old: string;


  public  rules: Object = {'X': /[02-9]/};
  public  buttonSubmitOptions : any = {
    text: "Lưu Lại",
    type: "success",
    useSubmitBehavior: true
  };


  constructor(
    private  router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private nhomnhacungcapService: NhomNhaCungCapService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.authenticationService.setDisableChiNhanh(true);
    });
    this.nhomnhacungcap = new NhomNhaCungCap();
    this.theCallBackValid = this.theCallBackValid.bind(this);

    //danh sách khu vực là tên nhóm nhà cung cấp trùng=> kiểm tra nhóm nhà cung cấp trùng
    this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x )));
    this.subscriptions.add(
      this.activatedRoute.params.subscribe((params) => {
        let manhomnhacungcap_id = params.id;
        if(manhomnhacungcap_id){
          this.subscriptions.add(
            this.nhomnhacungcapService.findNhomNhaCungCap(manhomnhacungcap_id).subscribe(
              (data)=>{
                this.nhomnhacungcap = data [0];
                this.manhomnhacungcap_old = this.nhomnhacungcap.manhomnhacungcap;
              },
              (error) =>{
                this.nhomnhacungcapService.handleError(error);
              }
            )
          );
        }
      })
    );
}
     
  ngOnDestroy(): void {
    this.authenticationService.setDisableChiNhanh(false);
    this.subscriptions.unsubscribe();
  }

  theCallBackValid(params){
    return  this.nhomnhacungcapService.checkExistNhomNhaCungCap(params.value, this.manhomnhacungcap_old);
  }

  onSubmitForm(e){
    if(!this.frmNhomNhaCungCapCapNhatComponent.instance.validate().isValid) return;
        
    let nhomnhacungcap_req = this.nhomnhacungcap;
    nhomnhacungcap_req.chinhanh_id = this.currentChiNhanh.id;
    this.saveProcessing = true;
    this.subscriptions.add(
      this.nhomnhacungcapService.updateNhomNhaCungCap(nhomnhacungcap_req).subscribe(
        data => {
            notify({
                width: 320,
                message: "Lưu thành công",
                position: { my: "right top", at: "right top"}
              }, "success", 475);
        this.router.navigate(['/nhom-nha-cung-cap']);
        this.saveProcessing = false;
      },
      error => {
        this.nhomnhacungcapService.handleError(error);
        this.saveProcessing  = false;
      }
    ));
    e.preventDefault();
  }


}
