import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuXuatVatTu } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, PhieuXuatVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';

@Component({
    selector: 'app-phieu-xuat-vat-tu-modal',
    templateUrl: './phieu-xuat-vat-tu-modal.component.html',
    styleUrls: ['./phieu-xuat-vat-tu-modal.component.css']
})
export class PhieuXuatVatTuModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatVatTu: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public phieuxuatvattu_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public phieuxuatvattu: PhieuXuatVatTu;
    public phieuxuatvattu_old: string;
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
        private phieuxuatvattuService: PhieuXuatVatTuService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuxuatvattu = new PhieuXuatVatTu();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        if (this.isView == 'view_add') {
            this.subscriptions.add(
                this.phieuxuatvattuService.findPhieuXuatVatTu(this.phieuxuatvattu_id).subscribe(
                    (data) => {
                        this.phieuxuatvattu = data;
                    },
                    (error) => {
                        this.phieuxuatvattuService.handleError(error);
                    }
                )
            );
        }
        if (this.isView == 'view_edit') {
            this.subscriptions.add(
                this.phieuxuatvattuService.findPhieuXuatVatTu(this.phieuxuatvattu_id).subscribe(
                    (data) => {
                        this.phieuxuatvattu = data;
                        this.phieuxuatvattu_old = this.phieuxuatvattu.maphieu;
                    },
                    (error) => {
                        this.phieuxuatvattuService.handleError(error);
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
            return this.phieuxuatvattuService.checkExistPhieuXuatVatTu(params.value, null);
        }
        if (this.isView == 'view_edit') {
            return this.phieuxuatvattuService.checkExistPhieuXuatVatTu(params.value, this.phieuxuatvattu_old);
        }
    }

    onSubmitForm(e) {
        if (!this.frmPhieuXuatVatTu.instance.validate().isValid) return;

        let phieuxuatvattu_req = this.phieuxuatvattu;
        phieuxuatvattu_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(phieuxuatvattu_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(phieuxuatvattu_req);
        }

        e.preventDefault();
    }

    onAddNew(phieuxuatvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatvattuService.addPhieuXuatVatTu(phieuxuatvattu_req).subscribe(
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
                    this.phieuxuatvattuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(phieuxuatvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatvattuService.updatePhieuXuatVatTu(phieuxuatvattu_req).subscribe(
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
                    this.phieuxuatvattuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onConfirm():void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    onCancel(): void{
        this.onClose.next(true);
        this.bsModalRef.hide();
    }
}
