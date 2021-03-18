import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppInfoService, PhieuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { PhieuChi } from '@app/shared/entities';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuChiInPhieuModalComponent } from '../../modals/phieu-chi-in-phieu-modal/phieu-chi-in-phieu-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-phieu-chi',
    templateUrl: './phieu-chi.component.html',
    styleUrls: ['./phieu-chi.component.css']
})
export class PhieuChiComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    public bsModalRef: BsModalRef;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU CHI - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuChi'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private objPhieuChiService: PhieuChiService,
        private authenticationService: AuthenticationService,
        private bsModalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU CHI | ' + this.appInfoService.appName);
    }

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
            this.objPhieuChiService.findPhieuChis(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuChiService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuChi_id: ${e.key.id}`);
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];

            //add a custom menu item
            e.items.push(
                {
                    text: 'UNC VCB',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuChi = e.row.key as PhieuChi;
                        /* Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'UNC VCB',
                            phieuchi_id: rowData.id,
                            loaiphieuchi: rowData.loaiphieuchi,
                            loaiphieuin: 'vcb'
                        };
                        /* Hiển thị modal */
                        this.bsModalRef = this.bsModalService.show(PhieuChiInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'UNC SCB',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuChi = e.row.key as PhieuChi;
                        /* Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'UNC SCB',
                            phieuchi_id: rowData.id,
                            loaiphieuchi: rowData.loaiphieuchi,
                            loaiphieuin: 'scb'
                        };
                        /* Hiển thị modal */
                        this.bsModalRef = this.bsModalService.show(PhieuChiInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'UNC ACB',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuChi = e.row.key as PhieuChi;
                        /* Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'UNC ACB',
                            phieuchi_id: rowData.id,
                            loaiphieuchi: rowData.loaiphieuchi,
                            loaiphieuin: 'acb'
                        };
                        /* Hiển thị modal */
                        this.bsModalRef = this.bsModalService.show(PhieuChiInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'MẪU C31',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuChi = e.row.key as PhieuChi;
                        /* Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'MẪU C31',
                            phieuchi_id: rowData.id,
                            loaiphieuchi: rowData.loaiphieuchi,
                            loaiphieuin: 'c31'
                        };
                        /* Hiển thị modal */
                        this.bsModalRef = this.bsModalService.show(PhieuChiInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
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
                    this.objPhieuChiService.deletePhieuChi(id).subscribe(
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
                            this.objPhieuChiService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
