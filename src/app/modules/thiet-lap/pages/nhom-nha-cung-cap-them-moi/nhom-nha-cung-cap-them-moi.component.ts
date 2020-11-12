import notify from 'devextreme/ui/notify';
import { NhomNhaCungCapService } from './../../../../shared/services/thiet-lap/nhom-nha-cung-cap.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NhomNhaCungCap } from './../../../../shared/entities/thiet-lap/nhom-nha-cung-cap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nhom-nha-cung-cap-them-moi',
  templateUrl: './nhom-nha-cung-cap-them-moi.component.html',
  styleUrls: ['./nhom-nha-cung-cap-them-moi.component.css']
})
export class NhomNhaCungCapThemMoiComponent implements OnInit {

  @ViewChild(DxFormComponent, {static: false}) frmNhomNhaCungCap: DxFormComponent;

  private subscriptions: Subscription;
  public  nhomnhacungcap: NhomNhaCungCap;

  public  saveProcessing = false;

  public rules: Object = { 'X': /[02-9]/};
  public buttonSubmitOptions: any ={
    text: " Lưu lại",
    type: "success",
    useSubmitBehavior: true
  }


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private nhomnhacungcapService: NhomNhaCungCapService
  ) { }

  ngAfterViewInit(){

  }

  ngOnInit(): void {
    this.nhomnhacungcap = new NhomNhaCungCap();
    this.theCallBackValid = this.theCallBackValid.bind(this);
  }
  ngOnDestroy(): void {
    if(this.subscriptions){
      this.subscriptions.unsubscribe();
    }
  }

  theCallBackValid(params){
    return this.nhomnhacungcapService.checkExistNhomNhaCungCap(params.value);
  }

  onSubmitForm(e){
    let nhomnhacungcap_req = this.nhomnhacungcap;

    this.saveProcessing = true;
    this.subscriptions = this.nhomnhacungcapService.addNhomNhaCungCap(nhomnhacungcap_req).subscribe(
      data => {
        notify({
          width:320,
          message: "Lưu thành công",
          position: {my: "right top", at: "right top"}
        }, "success", 475);
        this.router.navigate(['/nhom-nha-cung-cap']);
        this.saveProcessing = false;
      },
      error => {
        this.nhomnhacungcapService.handleError(error);
        this.saveProcessing = false;
      }
    );
    e.preventDefault();
  }

}
