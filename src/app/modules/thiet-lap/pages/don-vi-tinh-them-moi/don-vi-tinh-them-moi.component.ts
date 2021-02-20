import { ChiNhanh, DonViTinh } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DonViTinhService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-don-vi-tinh-them-moi',
    templateUrl: './don-vi-tinh-them-moi.component.html',
    styleUrls: ['./don-vi-tinh-them-moi.component.css']
})
export class DonViTinhThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDonViTinh: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public donvitinh: DonViTinh;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private donvitinhService: DonViTinhService
    ) { }

    ngAfterViewInit() {
        // this.frmDonViTinh.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.donvitinh = new DonViTinh();
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
        return this.donvitinhService.checkExistDonViTinh(params.value);
    }

    onSubmitForm(e) {
        let donvitinh_req = this.donvitinh;
        donvitinh_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.donvitinhService.addDonViTinh(donvitinh_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/don-vi-tinh']); // chuyển trang sau khi thêm
                this.frmDonViTinh.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.donvitinhService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}