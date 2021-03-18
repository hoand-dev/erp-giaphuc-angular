import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuNhapKhoGiaCong } from '@app/shared/entities';
import { AppInfoService, PhieuNhapKhoGiaCongService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';
import { PhieuNhapThanhPhamInPhieuModalComponent } from '../../modals/phieu-nhap-thanh-pham-in-phieu-modal/phieu-nhap-thanh-pham-in-phieu-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-phieu-nhap-kho-gia-cong',
    templateUrl: './phieu-nhap-kho-gia-cong.component.html',
    styleUrls: ['./phieu-nhap-kho-gia-cong.component.css']
})
export class PhieuNhapKhoGiaCongComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU NHẬP KHO GIA CÔNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuNhapKhoGiaCong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private objPhieuNhapKhoGiaCongService: PhieuNhapKhoGiaCongService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle("PHIẾU NHẬP KHO GIA CÔNG | " + this.appInfoService.appName);
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
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuNhapKhoGiaCongService.findPhieuNhapKhoGiaCongs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuNhapKhoGiaCongService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];
            e.items.push({
                text: 'In Phiếu',
                icon: 'print',
                visible: 'true',

                onItemClick: () => {
                    let rowData: PhieuNhapKhoGiaCong = e.row.key as PhieuNhapKhoGiaCong;

                    /*Khởi tạo giá trị trên modal */
                    const initialState = {
                        title: 'IN PHIẾU NHẬP KHO GIA CÔNG',
                        phieunhapkhogiacong_id: rowData.id
                    };

                    /* Hiển thị trên modal */
                    this.bsModalRef = this.modalService.show(PhieuNhapThanhPhamInPhieuModalComponent, {
                        class: 'modal-xl modal-dialog-centered',
                        ignoreBackdropClick: false,
                        keyboard: false,
                        initialState
                    });
                    this.bsModalRef.content.closeBtnName = 'Đóng';
                }
            });

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            // e.items.push(
            //     {
            //         text: "Cập nhật hoá đơn", icon: "edit", visible: true,
            //         onItemClick: () => {
            //             let rowData: PhieuNhapKhoGiaCong = e.row.key as PhieuNhapKhoGiaCong;
            //             this.onCapNhatHoaDon(rowData.id, rowData.maphieuxuatkho, rowData.chungtu);
            //         }
            //     }
            // );
        }
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuNhapKhoGiaCong_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuNhapKhoGiaCongService.deletePhieuNhapKhoGiaCong(id).subscribe(
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
                            this.objPhieuNhapKhoGiaCongService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
