import { ChiNhanh, DanhMucNo } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DanhMucNoService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-danh-muc-no-them-moi',
    templateUrl: './danh-muc-no-them-moi.component.html',
    styleUrls: ['./danh-muc-no-them-moi.component.css']
})
export class DanhMucNoThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucNo: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public danhmucno: DanhMucNo;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private danhmucnoService: DanhMucNoService
    ) { }

    ngAfterViewInit() {
        // this.frmDanhMucNo.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmucno = new DanhMucNo();
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
        return this.danhmucnoService.checkExistDanhMucNo(params.value);
    }

    onSubmitForm(e) {
        if(!this.frmDanhMucNo.instance.validate().isValid) return;
        
        let danhmucno_req = this.danhmucno;
        danhmucno_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.danhmucnoService.addDanhMucNo(danhmucno_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-no']); // chuyển trang sau khi thêm
                this.frmDanhMucNo.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.danhmucnoService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}