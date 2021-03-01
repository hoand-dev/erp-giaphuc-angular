import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuNhapKho } from '@app/shared/entities';
import { PhieuNhapKhoService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuNhapKhoInPhieuModalComponent } from '../../modals/phieu-nhap-kho-in-phieu-modal/phieu-nhap-kho-in-phieu-modal.component';

@Component({
    selector: 'app-phieu-nhap-kho',
    templateUrl: './phieu-nhap-kho.component.html',
    styleUrls: ['./phieu-nhap-kho.component.css']
})
export class PhieuNhapKhoComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuNhapKho'
    };

    constructor(private router: Router, private objPhieuNhapKhoService: PhieuNhapKhoService, private authenticationService: AuthenticationService, private modalService: BsModalService) {}

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
            this.objPhieuNhapKhoService.findPhieuNhapKhos(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuNhapKhoService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push(
                {
                    text: 'In phiếu (có giá)',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuNhapKho = e.row.key as PhieuNhapKho;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: 'XEM IN PHIẾU NHẬP KHO - CÓ GIÁ',
                            phieunhapkho_id: rowData.id,
                            loaiphieunhap: rowData.loaiphieunhapkho,
                            loaiphieuin: 'cogia'
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuNhapKhoInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'In phiếu (không giá)',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuNhapKho = e.row.key as PhieuNhapKho;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: 'XEM IN PHIẾU NHẬP KHO -  KHÔNG GIÁ',
                            phieunhapkho_id: rowData.id,
                            loaiphieunhap: rowData.loaiphieunhapkho,
                            loaiphieuin: 'khonggia'
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuNhapKhoInPhieuModalComponent, {
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

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuNhapKho_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuNhapKhoService.deletePhieuNhapKho(id).subscribe(
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
                            this.objPhieuNhapKhoService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
