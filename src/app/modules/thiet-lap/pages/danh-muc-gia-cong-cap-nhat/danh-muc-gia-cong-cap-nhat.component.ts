import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DanhMucGiaCong } from '@app/shared/entities';
import { DanhMucGiaCongService } from '@app/shared/services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-gia-cong-cap-nhat',
    templateUrl: './danh-muc-gia-cong-cap-nhat.component.html',
    styleUrls: ['./danh-muc-gia-cong-cap-nhat.component.css']
})
export class DanhMucGiaCongCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucGiaCong: DxFormComponent;

    private subscription: Subscription
    private subscriptionParams: Subscription;

    public danhmucgiacong: DanhMucGiaCong;
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
        private danhmucgiacongService: DanhMucGiaCongService) { }

    ngOnInit(): void {
        this.danhmucgiacong = new DanhMucGiaCong();

        this.subscriptionParams = this.activatedRoute.params.subscribe(params => {
            let danhmucgiacong_id = params.id;
            // lấy thông tin danh mục gia công
            if (danhmucgiacong_id) {
                this.subscription = this.danhmucgiacongService.findDanhMucGiaCong(danhmucgiacong_id).subscribe(
                    data => {
                        this.danhmucgiacong = data[0];
                    },
                    error => {
                        this.danhmucgiacongService.handleError(error);
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
        // giả sử mã danh mục gia công lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let danhmucgiacong_req = this.danhmucgiacong;
        this.saveProcessing = true;
        this.subscription = this.danhmucgiacongService.updateDanhMucGiaCong(danhmucgiacong_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-gia-cong']);
                // this.frmDanhMucGiaCong.instance.resetValues();
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
