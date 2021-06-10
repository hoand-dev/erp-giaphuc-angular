import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, LenhSanXuat } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, LenhSanXuatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-lenh-san-xuat-modal',
    templateUrl: './lenh-san-xuat-modal.component.html',
    styleUrls: ['./lenh-san-xuat-modal.component.css']
})
export class LenhSanXuatModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmLenhSanXuat: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public lenhsanxuat_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public lenhsanxuat: LenhSanXuat;
    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private lenhsanxuatService: LenhSanXuatService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.lenhsanxuat = new LenhSanXuat();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        if (this.isView == 'view_edit') {
            this.subscriptions.add(
                this.lenhsanxuatService.findLenhSanXuat(this.lenhsanxuat_id).subscribe(
                    (data) => {
                        this.lenhsanxuat = data;
                    },
                    (error) => {
                        this.lenhsanxuatService.handleError(error);
                    }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        if (this.isView == 'view_add') {
            return this.lenhsanxuatService.checkExistLenhSanXuat(params.value, null);
        }
        if (this.isView == 'view_edit') {
            return this.lenhsanxuatService.checkExistLenhSanXuat(params.value, this.lenhsanxuat_old);
        }
    }

    onSubmitForm(e) {
        if (!this.frmLenhSanXuat.instance.validate().isValid) return;

        let lenhsanxuat_req = this.lenhsanxuat;
        lenhsanxuat_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(lenhsanxuat_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(lenhsanxuat_req);
        }

        e.preventDefault();
    }

    onAddNew(lenhsanxuat_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.lenhsanxuatService.addLenhSanXuat(lenhsanxuat_req).subscribe(
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

                    this.saveProcessing = false;
                    this.onConfirm();
                },
                (error) => {
                    this.lenhsanxuatService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(lenhsanxuat_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.lenhsanxuatService.updateLenhSanXuat(lenhsanxuat_req).subscribe(
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

                    this.saveProcessing = false;
                    this.onConfirm();
                },
                (error) => {
                    this.lenhsanxuatService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onConfirm(): void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
