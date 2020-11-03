import { ChiNhanh, SoMat } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { SoMatService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-so-mat-them-moi',
    templateUrl: './so-mat-them-moi.component.html',
    styleUrls: ['./so-mat-them-moi.component.css']
})
export class SoMatThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmSoMat: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public somat: SoMat;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private somatService: SoMatService
    ) { }

    ngAfterViewInit() {
        // this.frmSoMat.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.somat = new SoMat();
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã danh mục số mặt lấy dc từ api true (đã tồn tại) là "ssss"
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let somat_req = this.somat;
        somat_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.somatService.addSoMat(somat_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/so-mat']); // chuyển trang sau khi thêm
                this.frmSoMat.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.somatService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}