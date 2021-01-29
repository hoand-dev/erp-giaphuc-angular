import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuCanTru } from '@app/shared/entities';
import { PhieuCanTruService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as $ from 'jquery';
import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { PhieuCanTruInPhieuModalComponent } from '../../modals/phieu-can-tru-in-phieu-modal/phieu-can-tru-in-phieu-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-phieu-can-tru',
    templateUrl: './phieu-can-tru.component.html',
    styleUrls: ['./phieu-can-tru.component.css']
})
export class PhieuCanTruComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    public bsModalRef: BsModalRef;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuCanTru'
    };

    constructor(private router: Router, private objPhieuCanTruService: PhieuCanTruService, private authenticationService: AuthenticationService, private bsModalService: BsModalService) {}

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh /* .pipe(first()) */
                .subscribe((x) => {
                    this.onLoadData();
                })
        );

        // setTimeout(() => {
        //     $(".dx-clear-button-area").trigger("click");
        // });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuCanTruService.findPhieuCanTrus(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuCanTruService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuCanTru_id: ${e.key.id}`);
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];

            e.items.push(
                {
                    text: 'CẤN TRỪ KH - NCC',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuCanTru = e.row.key as PhieuCanTru;
                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'KH - NCC',
                            phieucantru_id: rowData.id,
                            loaicantru: rowData.loaicantru,
                            loaiphieuin: 'khncc'
                        };
                        /* Hiển thị trên modal */
                        this.bsModalRef = this.bsModalService.show(PhieuCanTruInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = ' Đóng';
                    }
                },
                {
                    text: 'CẤN TRỪ KH - DVGC',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuCanTru = e.row.key as PhieuCanTru;
                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'KH - DVGC',
                            phieucantru_id: rowData.id,
                            loaicantru: rowData.loaicantru,
                            loaiphieuin: 'khdvgc'
                        };
                        /* Hiển thị trên modal */
                        this.bsModalRef = this.bsModalService.show(PhieuCanTruInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = ' Đóng';
                    }
                }
            );
        }
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuCanTruService.deletePhieuCanTru(id).subscribe(
                        (data) => {
                            if (data) {
                                notify(
                                    {
                                        width: 320,
                                        message: 'Xóa thành công',
                                        position: { my: 'right top', at: 'right top' }
                                    },
                                    'success',
                                    475
                                );
                            }
                            // load lại dữ liệu
                            this.onLoadData();
                        },
                        (error) => {
                            this.objPhieuCanTruService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
