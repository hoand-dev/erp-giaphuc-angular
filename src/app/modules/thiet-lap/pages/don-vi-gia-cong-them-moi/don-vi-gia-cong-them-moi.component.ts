import { ChiNhanh, DonViGiaCong, KhoHang } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DonViGiaCongService, KhoHangService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-don-vi-gia-cong-them-moi',
    templateUrl: './don-vi-gia-cong-them-moi.component.html',
    styleUrls: ['./don-vi-gia-cong-them-moi.component.css']
})
export class DonViGiaCongThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDonViGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    private currentChiNhanh: ChiNhanh;

    public lstKhoHang: KhoHang[] = [];
    public donvigiacong: DonViGiaCong;

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
        private khogiacongService: KhoHangService,
        private donvigiacongService: DonViGiaCongService,
        private authenticationService: AuthenticationService
    ) { }

    ngAfterViewInit() {
        // this.frmDonViGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.donvigiacong = new DonViGiaCong();
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => {
            this.currentChiNhanh = x;
            // khi thêm mới thay đổi chi nhánh thì load lại danh sách kho hàng theo chi nhánh đó
            this.subscriptions.add(
                this.khogiacongService.findKhoHangs(this.currentChiNhanh.id).subscribe(
                    x => {
                        this.lstKhoHang = x;
                        // this.donvigiacong.khogiacong = null; // set trước dữ liệu khu vực
                    })
            );
        }));
        
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã đơn vị gia công lấy dc từ api true (đã tồn tại) là "ssss"
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let donvigiacong_req = this.donvigiacong;
        donvigiacong_req.chinhanh_id = this.currentChiNhanh.id;
        donvigiacong_req.khogiacong_id = donvigiacong_req.khogiacong.id; // set lại khogiacong_id
        donvigiacong_req.loaigiacong = this.donvigiacong.loaidonvi ? 2 : 1;

        this.saveProcessing = true;
        this.subscriptions.add(this.donvigiacongService.addDonViGiaCong(donvigiacong_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/don-vi-gia-cong']); // chuyển trang sau khi thêm
                this.frmDonViGiaCong.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.donvigiacongService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}