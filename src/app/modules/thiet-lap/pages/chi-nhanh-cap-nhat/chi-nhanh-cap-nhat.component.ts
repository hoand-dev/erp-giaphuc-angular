import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh } from '@app/shared/entities';
import { ChiNhanhService } from '@app/shared/services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

/* chưa tối ưu performance */

@Component({
    selector: 'app-chi-nhanh-cap-nhat',
    templateUrl: './chi-nhanh-cap-nhat.component.html',
    styleUrls: ['./chi-nhanh-cap-nhat.component.css']
})
export class ChiNhanhCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmChiNhanh: DxFormComponent;

    private subscription: Subscription
    private subscriptionParams: Subscription;

    public chinhanh: ChiNhanh;
    public saveProcessing = false;

    public rules: Object = { 'X': /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private chinhanhService: ChiNhanhService) { }

    ngOnInit(): void {
        this.chinhanh = new ChiNhanh();

        this.subscriptionParams = this.activatedRoute.params.subscribe(params => {
            let chinhanh_id = params.id;
            // lấy thông tin chi nhánh
            if (chinhanh_id) {
                this.subscription = this.chinhanhService.findChiNhanh(chinhanh_id).subscribe(
                    data => {
                        this.chinhanh = data[0];
                    },
                    error => {
                        this.chinhanhService.handleError(error);
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
        // giả sử mã chi nhánh lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let chinhanh_req = this.chinhanh;
        this.saveProcessing = true;
        this.subscription = this.chinhanhService.updateChiNhanh(chinhanh_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/chi-nhanh']);
                // this.frmChiNhanh.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.chinhanhService.handleError(error);
                this.saveProcessing = false;
            }
        );
        e.preventDefault();
    }
}
