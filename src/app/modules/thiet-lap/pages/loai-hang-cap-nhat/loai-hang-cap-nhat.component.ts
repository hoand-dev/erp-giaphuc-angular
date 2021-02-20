
import { Component,OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, LoaiHang } from '@app/shared/entities';
import { LoaiHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loai-hang-cap-nhat',
  templateUrl: './loai-hang-cap-nhat.component.html',
  styleUrls: ['./loai-hang-cap-nhat.component.css']
})
export class LoaiHangCapNhatComponent implements OnInit {

  @ViewChild(DxFormComponent, { static: false }) frmLoaiHang: DxFormComponent;

  /*tối ưu subscriptions*/

  subscriptions: Subscription = new Subscription();
  private currentChiNhanh: ChiNhanh;

  public loaihang: LoaiHang;
  public saveProcessing = false;
  loaihang_old: string;

  public rules: Object = {'X': /[02-9]/};
  public buttonSubmitOptions: any = {
    text: "Lưu lại",
    type: "success",
    useSubmitBehavior: true
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private loaihangService: LoaiHangService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
        this.authenticationService.setDisableChiNhanh(true);
    });
    this.loaihang = new LoaiHang();
    this.theCallbackValid = this.theCallbackValid.bind(this);

    this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
    this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
      let loaihang_id = params.id;
      
      if(loaihang_id) {
        this.subscriptions.add(this.loaihangService.findLoaiHang(loaihang_id).subscribe(
          data => {
            this.loaihang = data [0];
            this.loaihang_old =  this.loaihang.maloaihang;
          },
          error => {
            this.loaihangService.handleError(error);
          }
        ));
      }
    })); 
  }

  ngOnDestroy() {
    this.authenticationService.setDisableChiNhanh(false);
    this.subscriptions.unsubscribe();
  }
  
  theCallbackValid(params){
      return this.loaihangService.checkLoaiHangExist(params.value, this.loaihang_old);
  }

  onSubmitForm(e) {
    let loaihang_req = this.loaihang;
    loaihang_req.chinhanh_id = this.currentChiNhanh.id;

    this.saveProcessing = true;
    this.subscriptions.add(this.loaihangService.updateLoaiHang(loaihang_req).subscribe(
      data => {
        notify({
          width: 320,
          message: "Lưu thành công",
          position: { my: "right top", at: "right top"}
        }, "success", 475);
        this.router.navigate(["/loai-hang"]);
        this.saveProcessing = false;
      },
        error => {
          this.loaihangService.handleError(error);
          this.saveProcessing = false;
        }
      ));
      e.preventDefault();
  }
}
