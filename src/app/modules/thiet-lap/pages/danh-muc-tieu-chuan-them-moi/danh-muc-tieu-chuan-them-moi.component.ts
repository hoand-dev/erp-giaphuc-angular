import { ChiNhanh, DanhMucTieuChuan } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { DanhMucTieuChuanService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-danh-muc-tieu-chuan-them-moi',
    templateUrl: './danh-muc-tieu-chuan-them-moi.component.html',
    styleUrls: ['./danh-muc-tieu-chuan-them-moi.component.css']
})
export class DanhMucTieuChuanThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmDanhMucTieuChuan: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public danhmuctieuchuan: DanhMucTieuChuan;
    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private danhmuctieuchuanService: DanhMucTieuChuanService) {}

    ngAfterViewInit() {
        // this.frmDanhMucTieuChuan.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmuctieuchuan = new DanhMucTieuChuan();
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
        return this.danhmuctieuchuanService.checkExistDanhMucTieuChuan(params.value);
    }

    onSubmitForm(e) {
        if (!this.frmDanhMucTieuChuan.instance.validate().isValid) return;

        let danhmuctieuchuan_req = this.danhmuctieuchuan;
        danhmuctieuchuan_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.danhmuctieuchuanService.addDanhMucTieuChuan(danhmuctieuchuan_req).subscribe(
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
                    this.router.navigate(['/danh-muc-tieu-chuan']); // chuyển trang sau khi thêm
                    this.frmDanhMucTieuChuan.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.danhmuctieuchuanService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
