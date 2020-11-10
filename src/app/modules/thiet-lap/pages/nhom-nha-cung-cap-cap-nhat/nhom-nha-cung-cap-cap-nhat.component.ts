
import { NhomNhaCungCap } from './../../../../shared/entities/thiet-lap/nhom-nha-cung-cap';
import { NhomNhaCungCapService } from './../../../../shared/services/thiet-lap/nhom-nha-cung-cap.service';
import { DxFormComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-nhom-nha-cung-cap-cap-nhat',
  templateUrl: './nhom-nha-cung-cap-cap-nhat.component.html',
  styleUrls: ['./nhom-nha-cung-cap-cap-nhat.component.css']
})
export class NhomNhaCungCapCapNhatComponent implements OnInit {

  @ViewChild(DxFormComponent, {static: false}) frmNhomNhaCungCapCapNhatComponent: DxFormComponent;

  /*tối ưu subscriptions */

  subscriptions: Subscription = new Subscription();

  public nhomnhacungcap: NhomNhaCungCap;
  public  manhomnhacungcap_old: string;
  public  saveProcessing = false;

  public  rules: Object = {'X': /[02-9]/};
  public  buttonSubmitOptions : any = {
    text: "Lưu Lại",
    type: "success",
    useSubmitBehavior: true
  };
  theCallbackValid: any;

  constructor(
    private  router: Router,
    private activatedRoute: ActivatedRoute,
    private nhomnhacungcapService: NhomNhaCungCapService
  ) { }

  ngOnInit(): void {
    this.nhomnhacungcap = new NhomNhaCungCap();
    this.theCallbackValid = this.theCallbackValid.bind(this);
    this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
      let nhomnhacungcap_id = params.id;

      //lấy thông tin nhà cung cấp

      if(nhomnhacungcap_id){
        this.subscriptions.add(this.nhomnhacungcapService.findNhomNhaCungCap(nhomnhacungcap_id).subscribe(
          data => {
            this.nhomnhacungcap = data [0];
            this.manhomnhacungcap_old = this.nhomnhacungcap.manhomnhacungcap;
          },
          error => {
            this.nhomnhacungcapService.handleError(error);
          }
        ));
      }
      }));
    }
     
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  theCallBackValid(params){
    return  this.nhomnhacungcapService.checkExistNhomNhaCungCap(params.value, this.manhomnhacungcap_old);
  }

  onSubmitForm(e){
    let nhomnhacungcap_req = this.nhomnhacungcap;
    this.saveProcessing = true;
    this.subscriptions.add(this.nhomnhacungcapService.updateNhomNhaCungCap(nhomnhacungcap_req).subscribe(
      data => {
        notify({
          width: 320,
          mesesage: "Lưu thành công",
          position: {my: "right top", at: "right top"}
        }, "success", 475);
        this.router.navigate(['/nhomnhacungcap']);
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
