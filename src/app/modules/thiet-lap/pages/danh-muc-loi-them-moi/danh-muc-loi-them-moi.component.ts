import { ChiNhanh, DanhMucLoi } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DanhMucLoiService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-danh-muc-loi-them-moi',
    templateUrl: './danh-muc-loi-them-moi.component.html',
    styleUrls: ['./danh-muc-loi-them-moi.component.css']
})
export class DanhMucLoiThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucLoi: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public danhmucloi: DanhMucLoi;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private danhmucloiService: DanhMucLoiService,
        private authenticationService: AuthenticationService
    ) { }

    ngAfterViewInit() {
        // this.frmDanhMucLoi.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmucloi = new DanhMucLoi();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params){	
        return this.danhmucloiService.checkExistDanhMucLoi(params.value);
    }

    onSubmitForm(e) {
        if(!this.frmDanhMucLoi.instance.validate().isValid) return;
        
        let danhmucloi_req = this.danhmucloi;
        danhmucloi_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.danhmucloiService.addDanhMucLoi(danhmucloi_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-loi']); // chuyển trang sau khi thêm
                this.frmDanhMucLoi.instance.resetValues();
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