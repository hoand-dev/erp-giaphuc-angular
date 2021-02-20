import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, QuyTaiKhoan } from '@app/shared/entities';
import { QuyTaiKhoanService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-quy-tai-khoan-cap-nhat',
    templateUrl: './quy-tai-khoan-cap-nhat.component.html',
    styleUrls: ['./quy-tai-khoan-cap-nhat.component.css']
})
export class QuyTaiKhoanCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmQuyTaiKhoan: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public quytaikhoan: QuyTaiKhoan;
    public saveProcessing = false;

    public maquy_old: string;

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
        private quytaikhoanService: QuyTaiKhoanService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.quytaikhoan = new QuyTaiKhoan();

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let quytaikhoan_id = params.id;
            // lấy thông tin quỹ
            if (quytaikhoan_id) {
                this.subscriptions.add(this.quytaikhoanService.findQuyTaiKhoan(quytaikhoan_id).subscribe(
                    data => {
                        this.quytaikhoan = data[0];
                        this.maquy_old = this.quytaikhoan.maquy;
                    },
                    error => {
                        this.quytaikhoanService.handleError(error);
                    }
                ));
            }
        }));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params){
        return this.quytaikhoanService.checkExistQuyTaiKhoan(params.value, this.maquy_old);
    }

    onSubmitForm(e) {
        let quytaikhoan_req = this.quytaikhoan;
        quytaikhoan_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.quytaikhoanService.updateQuyTaiKhoan(quytaikhoan_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/quy-tai-khoan']);
                // this.frmQuyTaiKhoan.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.quytaikhoanService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}