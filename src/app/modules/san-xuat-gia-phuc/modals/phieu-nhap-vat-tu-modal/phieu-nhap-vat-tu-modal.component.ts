import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuNhapVatTu } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, PhieuNhapVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-phieu-nhap-vat-tu-modal',
  templateUrl: './phieu-nhap-vat-tu-modal.component.html',
  styleUrls: ['./phieu-nhap-vat-tu-modal.component.css']
})
export class PhieuNhapVatTuModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmphieunhapvattu: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public phieunhapvattu_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public phieunhapvattu: PhieuNhapVatTu;
    public phieunhapvattu_old: string;
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
        private phieunhapvattuService: PhieuNhapVatTuService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhapvattu = new PhieuNhapVatTu();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        if (this.isView == 'view_add') {
            this.subscriptions.add(
                this.phieunhapvattuService.findPhieuNhapVatTu(this.phieunhapvattu_id).subscribe(
                    (data) => {
                        this.phieunhapvattu = data;
                    },
                    (error) => {
                        this.phieunhapvattuService.handleError(error);
                    }
                )
            );
        }
        if (this.isView == 'view_edit') {
            this.subscriptions.add(
                this.phieunhapvattuService.findPhieuNhapVatTu(this.phieunhapvattu_id).subscribe(
                    (data) => {
                        this.phieunhapvattu = data;
                        this.phieunhapvattu_old = this.phieunhapvattu.maphieu;
                    },
                    (error) => {
                        this.phieunhapvattuService.handleError(error);
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
            return this.phieunhapvattuService.checkExistPhieuNhapVatTu(params.value, null);
        }
        if (this.isView == 'view_edit') {
            return this.phieunhapvattuService.checkExistPhieuNhapVatTu(params.value, this.phieunhapvattu_old);
        }
    }

    onSubmitForm(e) {
        if (!this.frmphieunhapvattu.instance.validate().isValid) return;

        let phieunhapvattu_req = this.phieunhapvattu;
        phieunhapvattu_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(phieunhapvattu_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(phieunhapvattu_req);
        }

        e.preventDefault();
    }

    onAddNew(phieunhapvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapvattuService.addPhieuNhapVatTu(phieunhapvattu_req).subscribe(
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
                    this.phieunhapvattuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(phieunhapvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapvattuService.updatePhieuNhapVatTu(phieunhapvattu_req).subscribe(
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
                    this.phieunhapvattuService.handleError(error);
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
