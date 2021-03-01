import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuXuatChuyenKho } from '@app/shared/entities';
import { PhieuNhapChuyenKhoService, PhieuXuatChuyenKhoService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { PhieuXuatChuyenKhoInPhieuModalComponent } from '../../modals/phieu-xuat-chuyen-kho-in-phieu-modal/phieu-xuat-chuyen-kho-in-phieu-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-phieu-xuat-chuyen-kho',
    templateUrl: './phieu-xuat-chuyen-kho.component.html',
    styleUrls: ['./phieu-xuat-chuyen-kho.component.css']
})
export class PhieuXuatChuyenKhoComponent implements OnInit, OnDestroy, AfterViewInit {
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
        storageKey: 'dxGrid_PhieuXuatChuyenKho'
    };

    constructor(private router: Router, private objPhieuXuatChuyenKhoService: PhieuXuatChuyenKhoService, private authenticationService: AuthenticationService, private modalService: BsModalService) {}

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
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuXuatChuyenKhoService.findPhieuXuatChuyenKhos(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuXuatChuyenKhoService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuXuatChuyenKho_id: ${e.key.id}`);
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];

            e.items.push({
                text: 'In Phiếu',
                icon: 'print',
                visible: 'true',

                onItemClick: () => {
                    let rowData: PhieuXuatChuyenKho = e.row.key as PhieuXuatChuyenKho;

                    /*Khởi tạo giá trị trên modal */
                    const initialState = {
                        title: 'IN PHIẾU XUẤT CHUYỂN KHO',
                        phieuxuatchuyenkho_id: rowData.id
                    };

                    /* Hiển thị trên modal */
                    this.bsModalRef = this.modalService.show(PhieuXuatChuyenKhoInPhieuModalComponent, {
                        class: 'modal-xl modal-dialog-centered',
                        ignoreBackdropClick: false,
                        keyboard: false,
                        initialState
                    });
                    this.bsModalRef.content.closeBtnName = 'Đóng';
                }
            });
        }
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuXuatChuyenKhoService.deletePhieuXuatChuyenKho(id).subscribe(
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
                            this.objPhieuXuatChuyenKhoService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
