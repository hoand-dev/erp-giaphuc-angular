import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, DanhMucPhi } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DanhMucPhiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-phi-modal',
    templateUrl: './danh-muc-phi-modal.component.html',
    styleUrls: ['./danh-muc-phi-modal.component.css']
})
export class DanhMucPhiModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmDanhMucPhi: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public danhmucphi_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public danhmucphi: DanhMucPhi;
    public danhmucphi_old: string;
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
        private danhmucphiService: DanhMucPhiService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.danhmucphi = new DanhMucPhi();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        // if (this.isView == 'view_add') {
        //     this.subscriptions.add(
        //         this.danhmucphiService.ip().subscribe(
        //             (data) => {
        //                 this.danhmucphi.danhmucphi = data.query;
        //             },
        //             (error) => {
        //                 this.danhmucphiService.handleError(error);
        //             }
        //         )
        //     );
        // }

        if (this.isView == 'view_edit') {
            this.subscriptions.add(
                this.danhmucphiService.findDanhMucPhi(this.danhmucphi_id).subscribe(
                    (data) => {
                        this.danhmucphi = data;
                        this.danhmucphi_old = this.danhmucphi.madanhmucphi;
                    },
                    (error) => {
                        this.danhmucphiService.handleError(error);
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
            return this.danhmucphiService.checkExistDanhMucPhi(params.value, null);
        }
        if (this.isView == 'view_edit') {
            return this.danhmucphiService.checkExistDanhMucPhi(params.value, this.danhmucphi_old);
        }
    }

    onSubmitForm(e) {
        if (!this.frmDanhMucPhi.instance.validate().isValid) return;

        let danhmucphi_req = this.danhmucphi;
        danhmucphi_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(danhmucphi_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(danhmucphi_req);
        }

        e.preventDefault();
    }

    onAddNew(danhmucphi_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.danhmucphiService.addDanhMucPhi(danhmucphi_req).subscribe(
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
                    this.danhmucphiService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(danhmucphi_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.danhmucphiService.updateDanhMucPhi(danhmucphi_req).subscribe(
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
                    this.danhmucphiService.handleError(error);
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
