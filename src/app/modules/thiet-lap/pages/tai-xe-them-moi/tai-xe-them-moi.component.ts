import { AuthenticationService } from './../../../../_services/authentication.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh } from '@app/shared/entities';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';


import { 
  DxFormComponent
}from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { TaiXeService } from '@app/shared/services';


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
    this.subscriptions.add

  }
  

}
