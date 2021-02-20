import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DanhMucLoi } from '@app/shared/entities';
import { DanhMucLoiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-loi-cap-nhat',
    templateUrl: './danh-muc-loi-cap-nhat.component.html',
    styleUrls: ['./danh-muc-loi-cap-nhat.component.css']
})
export class DanhMucLoiCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucLoi: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public danhmucloi: DanhMucLoi;

    public madanhmucloi_old: string;
    public saveProcessing = false;

    public rules: Object = { 'X': /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router, 
        private activatedRoute: ActivatedRoute, 
        private authenticationService: AuthenticationService,
        private danhmucloiService: DanhMucLoiService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmucloi = new DanhMucLoi();

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let danhmucloi_id = params.id;
            // lấy thông tin danh mục lỗi
            if (danhmucloi_id) {
                this.subscriptions.add(this.danhmucloiService.findDanhMucLoi(danhmucloi_id).subscribe(
                    data => {
                        this.danhmucloi = data[0];
                        this.madanhmucloi_old = this.danhmucloi.madanhmucloi;
                    },
                    error => {
                        this.danhmucloiService.handleError(error);
                    }
                ));
            }
        }));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params){
        return this.danhmucloiService.checkExistDanhMucLoi(params.value, this.madanhmucloi_old);
    }

    onSubmitForm(e) {
        let danhmucloi_req = this.danhmucloi;
        danhmucloi_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.danhmucloiService.updateDanhMucLoi(danhmucloi_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-loi']);
                // this.frmDanhMucLoi.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.danhmucloiService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}
