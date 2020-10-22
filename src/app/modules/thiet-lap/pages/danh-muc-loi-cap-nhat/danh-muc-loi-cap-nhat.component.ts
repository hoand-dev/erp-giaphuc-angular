import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DanhMucLoi } from '@app/shared/entities';
import { DanhMucLoiService } from '@app/shared/services';
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

    private subscription: Subscription
    private subscriptionParams: Subscription;

    public danhmucloi: DanhMucLoi;
    public saveProcessing = false;

    public rules: Object = { 'X': /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router, private activatedRoute: ActivatedRoute, private danhmucloiService: DanhMucLoiService) { }

    ngOnInit(): void {
        this.danhmucloi = new DanhMucLoi();

        this.subscriptionParams = this.activatedRoute.params.subscribe(params => {
            let danhmucloi_id = params.id;
            // lấy thông tin danh mục lỗi
            if (danhmucloi_id) {
                this.subscription = this.danhmucloiService.findDanhMucLoi(danhmucloi_id).subscribe(
                    data => {
                        this.danhmucloi = data[0];
                    },
                    error => {
                        this.danhmucloiService.handleError(error);
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
        // giả sử mã danh mục lỗi lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let danhmucloi_req = this.danhmucloi;
        this.saveProcessing = true;
        this.subscription = this.danhmucloiService.updateDanhMucLoi(danhmucloi_req).subscribe(
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
        );
        e.preventDefault();
    }
}
