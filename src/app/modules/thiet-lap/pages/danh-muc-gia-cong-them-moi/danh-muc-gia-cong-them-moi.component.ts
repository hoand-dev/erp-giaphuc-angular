import { ChiNhanh, DanhMucGiaCong } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { DanhMucGiaCongService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-danh-muc-gia-cong-them-moi',
    templateUrl: './danh-muc-gia-cong-them-moi.component.html',
    styleUrls: ['./danh-muc-gia-cong-them-moi.component.css']
})
export class DanhMucGiaCongThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmDanhMucGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    private currentChiNhanh: ChiNhanh;

    public danhmucgiacong: DanhMucGiaCong;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private danhmucgiacongService: DanhMucGiaCongService) {}

    ngAfterViewInit() {
        // this.frmDanhMucGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmucgiacong = new DanhMucGiaCong();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.danhmucgiacongService.checkExistDanhMucGiaCong(params.value);
    }

    onSubmitForm(e) {
        if (!this.frmDanhMucGiaCong.instance.validate().isValid) return;

        let danhmucgiacong_req = this.danhmucgiacong;
        danhmucgiacong_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.danhmucgiacongService.addDanhMucGiaCong(danhmucgiacong_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: 'Lưu thành công',
                            position: { my: 'right top', at: 'right top' }
                        },
                        'success',
                        475
                    );
                    this.router.navigate(['/danh-muc-gia-cong']); // chuyển trang sau khi thêm
                    this.frmDanhMucGiaCong.instance.resetValues(); // khởi tạo lại giá trị của form
                    this.saveProcessing = false;
                },
                (error) => {
                    this.danhmucgiacongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
