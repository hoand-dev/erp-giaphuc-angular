import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhuVuc } from '@app/shared/entities';
import { KhuVucService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-khu-vuc-them-moi',
  templateUrl: './khu-vuc-them-moi.component.html',
  styleUrls: ['./khu-vuc-them-moi.component.css']
})
export class KhuVucThemMoiComponent implements OnInit {

  @ViewChild(DxFormComponent, { static: false }) frmKhuVuc: DxFormComponent;

  subscriptions: Subscription = new Subscription();  
  private currentChiNhanh: ChiNhanh;
  public khuvuc: KhuVuc;

 

  public saveProcessing = false;

  public rules: Object = { 'X': /[02-9]/};
  public buttonSubmitOptions: any = {
    text: "Lưu lại",
    type: "success",
    useSubmitBehavior: true
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private khuvucService: KhuVucService,
    private authenticationService: AuthenticationService,
  ) { }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    setTimeout(() => {
        this.authenticationService.setDisableChiNhanh(true);
    });
    this.khuvuc = new KhuVuc();
    this.theCallbackValid = this.theCallbackValid.bind(this);
    this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh =x));

  }

  ngOnDestroy(): void {
    
    // xử lý trước khi thoát khỏi trang
    this.authenticationService.setDisableChiNhanh(false);
      this.subscriptions.unsubscribe();
    
  }

    theCallbackValid(params) {
      return this.khuvucService.checkKhuVucExist(params.value);
    }

    onSubmitForm(e) {
      let khuvuc_req = this.khuvuc;
      khuvuc_req.chinhanh_id = this.currentChiNhanh.id;

      this.saveProcessing = true;
      this.subscriptions = this.khuvucService.addKhuVuc(khuvuc_req).subscribe(
        data => {
          notify({
            width: 320,
            message: "Lưu thành công",
            position: { my: "right top", at: "right top"}
          }, "success", 475);
          this.router.navigate(["/khu-vuc"]); // chuyển trang sau khi thêm
          this.frmKhuVuc.instance.resetValues();
          this.saveProcessing = false;
        },
        error => {
          this.khuvucService.handleError(error);
          this.saveProcessing = false;
        }
      );
        e.preventDefault();

    

  }

}
