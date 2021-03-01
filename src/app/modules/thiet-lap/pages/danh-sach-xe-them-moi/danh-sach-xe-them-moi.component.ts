import { DanhSachXeService } from './../../../../shared/services/thiet-lap/danh-sach-xe.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { SoMatService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { ChiNhanh } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';

@Component({
    selector: 'app-danh-sach-xe-them-moi',
    templateUrl: './danh-sach-xe-them-moi.component.html',
    styleUrls: ['./danh-sach-xe-them-moi.component.css']
})
export class DanhSachXeThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmDanhSachXe: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public danhsachxe: DanhSachXe;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private danhsachxeService: DanhSachXeService) {}

    ngAfterViewInit() {
        // this.frmSoMat.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhsachxe = new DanhSachXe();
        this.theCallbackValid = this.theCallbackValid.bind(this); // binding function sang html sau compile
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
        return this.danhsachxeService.checkDanhSachXeExist(params.value);
    }

    onSubmitForm(e) {
        if (!this.frmDanhSachXe.instance.validate().isValid) return;

        let danhsachxe_req = this.danhsachxe;
        danhsachxe_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.danhsachxeService.addDanhSachXe(danhsachxe_req).subscribe(
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
                    this.router.navigate(['/danh-sach-xe']); // chuyển trang sau khi thêm
                    this.frmDanhSachXe.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.danhsachxeService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
