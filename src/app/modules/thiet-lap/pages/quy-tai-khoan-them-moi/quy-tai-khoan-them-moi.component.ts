import { ChiNhanh, QuyTaiKhoan } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { QuyTaiKhoanService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-quy-tai-khoan-them-moi',
    templateUrl: './quy-tai-khoan-them-moi.component.html',
    styleUrls: ['./quy-tai-khoan-them-moi.component.css']
})
export class QuyTaiKhoanThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmQuyTaiKhoan: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public quytaikhoan: QuyTaiKhoan;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private quytaikhoanService: QuyTaiKhoanService) {}

    ngAfterViewInit() {
        // this.frmQuyTaiKhoan.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.quytaikhoan = new QuyTaiKhoan();
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
        return this.quytaikhoanService.checkExistQuyTaiKhoan(params.value);
    }

    onSubmitForm(e) {
        if (!this.frmQuyTaiKhoan.instance.validate().isValid) return;

        let quytaikhoan_req = this.quytaikhoan;
        quytaikhoan_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.quytaikhoanService.addQuyTaiKhoan(quytaikhoan_req).subscribe(
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
                    this.router.navigate(['/quy-tai-khoan']); // chuyển trang sau khi thêm
                    this.frmQuyTaiKhoan.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.quytaikhoanService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
