
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';


import { 
  DxFormComponent
}from 'devextreme-angular';

import { TaiXeService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { ChiNhanh } from '@app/shared/entities';


@Component({
  selector: 'app-tai-xe-them-moi',
  templateUrl: './tai-xe-them-moi.component.html',
  styleUrls: ['./tai-xe-them-moi.component.css']
})
export class TaiXeThemMoiComponent implements OnInit {

  @ViewChild(DxFormComponent, { static: false }) frmTaiXe: DxFormComponent;

  /*tối ưu subscriptions*/

  subscriptions: Subscription = new Subscription();
  private currentChiNhanh: ChiNhanh;
  public taixe: TaiXe;
  public saveProcessing = false;

  public buttonSubmitOptions: any = {
    text: "Lưu lại",
    type: "success",
    useSubmitBehavior: true
  }

  constructor(
    private router: Router,
    private authenticationService : AuthenticationService,
    private taixeService: TaiXeService,
   ) { }

   ngAfterViewInit() {
    // this.frmSoMat.instance.validate(); // showValidationSummary sau khi focus out
  }


  ngOnInit(): void {
    this.taixe = new TaiXe();
    this.theCallbackValid = this.theCallbackValid.bind(this); // binding function sang html sau compile
    this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x =>this.currentChiNhanh =x))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  theCallbackValid(params){
    return this.taixeService.checkTaiXeExist(params.value);
  }

  onSubmitForm(e){
    let taixe_req = this.taixe;
    taixe_req.chinhanh_id = this.currentChiNhanh.id;

    this.saveProcessing = true;
    this.subscriptions.add(this.taixeService.addTaiXe(taixe_req).subscribe(
      data => {
        notify({
          width: 320,
          message: "Lưu thành công",
          position: {my: "right top", at: "right top"}
        },"success", 475);
        this.router.navigate(['/tai-xe']);
        this.frmTaiXe.instance.resetValues();
        this.saveProcessing =true;
      },
      error => {
        this.taixeService.handleError(error);
        this.saveProcessing = false;
      },
    ));
      e.preventDefault();
  }
  

}
