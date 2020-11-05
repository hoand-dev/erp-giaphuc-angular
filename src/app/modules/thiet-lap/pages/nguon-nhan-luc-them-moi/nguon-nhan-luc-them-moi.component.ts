import { ChiNhanh, NguonNhanLuc } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { NguonNhanLucService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-nguon-nhan-luc-them-moi',
    templateUrl: './nguon-nhan-luc-them-moi.component.html',
    styleUrls: ['./nguon-nhan-luc-them-moi.component.css']
})
export class NguonNhanLucThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmNguonNhanLuc: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public nguonnhanluc: NguonNhanLuc;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private nguonnhanlucService: NguonNhanLucService
    ) { }

    ngAfterViewInit() {
        // this.frmNguonNhanLuc.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.nguonnhanluc = new NguonNhanLuc();
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã nguồn nhân lực lấy dc từ api true (đã tồn tại) là "ssss"
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let nguonnhanluc_req = this.nguonnhanluc;
        nguonnhanluc_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.nguonnhanlucService.addNguonNhanLuc(nguonnhanluc_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/nguon-nhan-luc']); // chuyển trang sau khi thêm
                this.frmNguonNhanLuc.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.nguonnhanlucService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}