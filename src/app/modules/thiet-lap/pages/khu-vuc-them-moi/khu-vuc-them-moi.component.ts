
import { KhuVuc } from './../../../../shared/entities/thiet-lap/khu-vuc';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DxFormComponent } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { KhuVucService } from '@app/shared/services';

@Component({
  selector: 'app-khu-vuc-them-moi',
  templateUrl: './khu-vuc-them-moi.component.html',
  styleUrls: ['./khu-vuc-them-moi.component.css']
})
export class KhuVucThemMoiComponent implements OnInit {

  @ViewChild(DxFormComponent, { static: false }) frmKhuVuc: DxFormComponent;

  private subscription: Subscription;
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
    private khuvucService: KhuVucService
  ) { }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.khuvuc = new KhuVuc();
    this.theCallbackValid = this.theCallbackValid.bind(this); // binding function sang html sau compile
  }

  ngOnDestroy(): void {
    
    // xử lý trước khi thoát khỏi trang
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

    theCallbackValid(params) {
      return this.khuvucService.checkKhuVucExist(params.value);
    }

    onSubmitForm(e) {
      let khuvuc_req = this.khuvuc;

      this.saveProcessing = true;
      this.subscription = this.khuvucService.addKhuVuc(khuvuc_req).subscribe(
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
