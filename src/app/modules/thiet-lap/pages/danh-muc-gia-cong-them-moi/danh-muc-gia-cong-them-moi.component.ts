import { DanhMucGiaCong } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DanhMucGiaCongService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-gia-cong-them-moi',
    templateUrl: './danh-muc-gia-cong-them-moi.component.html',
    styleUrls: ['./danh-muc-gia-cong-them-moi.component.css']
})
export class DanhMucGiaCongThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucGiaCong: DxFormComponent;

    private subscription: Subscription;

    public danhmucgiacong: DanhMucGiaCong;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private danhmucgiacongService: DanhMucGiaCongService
    ) { }

    ngAfterViewInit() {
        // this.frmDanhMucGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.danhmucgiacong = new DanhMucGiaCong();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã danh mục gia công lấy dc từ api true (đã tồn tại) là "ssss"
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let danhmucgiacong_req = this.danhmucgiacong;
        this.saveProcessing = true;
        this.subscription = this.danhmucgiacongService.addDanhMucGiaCong(danhmucgiacong_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-gia-cong']); // chuyển trang sau khi thêm
                this.frmDanhMucGiaCong.instance.resetValues(); // khởi tạo lại giá trị của form
                this.saveProcessing = false;
            },
            error => {
                this.danhmucgiacongService.handleError(error);
                this.saveProcessing = false;
            }
        );
        e.preventDefault();
    }
}