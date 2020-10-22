import { DanhMucNo } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DanhMucNoService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-no-them-moi',
    templateUrl: './danh-muc-no-them-moi.component.html',
    styleUrls: ['./danh-muc-no-them-moi.component.css']
})
export class DanhMucNoThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucNo: DxFormComponent;

    private subscription: Subscription;
    public danhmucno: DanhMucNo;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private danhmucnoService: DanhMucNoService
    ) { }

    ngAfterViewInit() {
        // this.frmDanhMucNo.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.danhmucno = new DanhMucNo();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã danh mục nợ lấy dc từ api true (đã tồn tại) là "ssss"
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let danhmucno_req = this.danhmucno;
        this.saveProcessing = true;
        this.subscription = this.danhmucnoService.addDanhMucNo(danhmucno_req).subscribe(
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
        );
        e.preventDefault();
    }
}