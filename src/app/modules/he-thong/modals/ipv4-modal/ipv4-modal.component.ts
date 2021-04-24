import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, Ipv4 } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, Ipv4Service } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-ipv4-modal',
    templateUrl: './ipv4-modal.component.html',
    styleUrls: ['./ipv4-modal.component.css']
})
export class Ipv4ModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmIpv4: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public ipv4_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public ipv4: Ipv4;
    public ipv4_old: string;
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
        private ipv4Service: Ipv4Service,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.ipv4 = new Ipv4();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );
        
        if(this.isView == 'view_add'){
            this.subscriptions.add(
                this.ipv4Service.ip().subscribe(
                    (data) => {
                        this.ipv4.ipv4 = data.query;
                    },
                    (error) => {
                        this.ipv4Service.handleError(error);
                    }
                )
            );
        }

        if (this.isView == 'view_edit') {
            this.subscriptions.add(
                this.ipv4Service.findIpv4(this.ipv4_id).subscribe(
                    (data) => {
                        this.ipv4 = data;
                        this.ipv4_old = this.ipv4.ipv4;
                    },
                    (error) => {
                        this.ipv4Service.handleError(error);
                    }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        if(this.isView == 'view_add'){
            return this.ipv4Service.checkExistIpv4(params.value, null);
        }
        if (this.isView == 'view_edit') {
            return this.ipv4Service.checkExistIpv4(params.value, this.ipv4_old);
        }
    }

    onSubmitForm(e) {
        if (!this.frmIpv4.instance.validate().isValid) return;

        let ipv4_req = this.ipv4;
        ipv4_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(ipv4_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(ipv4_req);
        }

        e.preventDefault();
    }

    onAddNew(ipv4_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.ipv4Service.addIpv4(ipv4_req).subscribe(
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
                    this.ipv4Service.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(ipv4_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.ipv4Service.updateIpv4(ipv4_req).subscribe(
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
                    this.ipv4Service.handleError(error);
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
