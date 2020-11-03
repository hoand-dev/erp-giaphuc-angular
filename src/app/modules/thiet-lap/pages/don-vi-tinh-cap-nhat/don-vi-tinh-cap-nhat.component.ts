import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DonViTinh } from '@app/shared/entities';
import { DonViTinhService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-don-vi-tinh-cap-nhat',
    templateUrl: './don-vi-tinh-cap-nhat.component.html',
    styleUrls: ['./don-vi-tinh-cap-nhat.component.css']
})
export class DonViTinhCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDonViTinh: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public donvitinh: DonViTinh;
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
        private authenticationService: AuthenticationService,
        private donvitinhService: DonViTinhService
    ) { }

    ngOnInit(): void {
        this.donvitinh = new DonViTinh();

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let donvitinh_id = params.id;
            // lấy thông tin đơn vị tính
            if (donvitinh_id) {
                this.subscriptions.add(this.donvitinhService.findDonViTinh(donvitinh_id).subscribe(
                    data => {
                        this.donvitinh = data[0];
                    },
                    error => {
                        this.donvitinhService.handleError(error);
                    }
                ));
            }
        }));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã đơn vị tính lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let donvitinh_req = this.donvitinh;
        donvitinh_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.donvitinhService.updateDonViTinh(donvitinh_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/don-vi-tinh']);
                // this.frmDonViTinh.instance.resetValues();
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