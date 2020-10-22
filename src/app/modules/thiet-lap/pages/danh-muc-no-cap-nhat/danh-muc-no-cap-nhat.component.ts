import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DanhMucNo } from '@app/shared/entities';
import { DanhMucNoService } from '@app/shared/services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-no-cap-nhat',
    templateUrl: './danh-muc-no-cap-nhat.component.html',
    styleUrls: ['./danh-muc-no-cap-nhat.component.css']
})
export class DanhMucNoCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucNo: DxFormComponent;

    private subscription: Subscription
    private subscriptionParams: Subscription;

    public danhmucno: DanhMucNo;
    public saveProcessing = false;

    public rules: Object = { 'X': /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router, private activatedRoute: ActivatedRoute, private danhmucnoService: DanhMucNoService) { }

    ngOnInit(): void {
        this.danhmucno = new DanhMucNo();

        this.subscriptionParams = this.activatedRoute.params.subscribe(params => {
            let danhmucno_id = params.id;
            // lấy thông tin danh mục nợ
            if (danhmucno_id) {
                this.subscription = this.danhmucnoService.findDanhMucNo(danhmucno_id).subscribe(
                    data => {
                        this.danhmucno = data[0];
                    },
                    error => {
                        this.danhmucnoService.handleError(error);
                    }
                );
            }
        });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        if (this.subscriptionParams)
            this.subscriptionParams.unsubscribe();

        if (this.subscription)
            this.subscription.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã danh mục nợ lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let danhmucno_req = this.danhmucno;
        this.saveProcessing = true;
        this.subscription = this.danhmucnoService.updateDanhMucNo(danhmucno_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-no']);
                // this.frmDanhMucNo.instance.resetValues();
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