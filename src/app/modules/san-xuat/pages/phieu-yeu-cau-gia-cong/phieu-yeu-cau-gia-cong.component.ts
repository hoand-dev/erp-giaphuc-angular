import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuYeuCauGiaCong } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuYeuCauGiaCongService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';
import { PhieuYeuCauGiaCongInPhieuModalComponent } from '../../modals/phieu-yeu-cau-gia-cong-in-phieu-modal/phieu-yeu-cau-gia-cong-in-phieu-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';
import { PhieuYeuCauGiaCongViewModalComponent } from '../../modals/phieu-yeu-cau-gia-cong-view-modal/phieu-yeu-cau-gia-cong-view-modal.component';

@Component({
    selector: 'app-phieu-yeu-cau-gia-cong',
    templateUrl: './phieu-yeu-cau-gia-cong.component.html',
    styleUrls: ['./phieu-yeu-cau-gia-cong.component.css']
})
export class PhieuYeuCauGiaCongComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* tất toán */
    public enableFinish: boolean = false;

    public bsModalRef: BsModalRef;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU YÊU CẦU GIA CÔNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuYeuCauGiaCong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuYeuCauGiaCongService: PhieuYeuCauGiaCongService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU YÊU CẦU GIA CÔNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieuyeucaugiacong-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieuyeucaugiacong-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieuyeucaugiacong-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieuyeucaugiacong-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieuyeucaugiacong-xuatdulieu');
                    this.enableFinish = this.commonService.getEnablePermission(this.permissions, 'phieuyeucaugiacong-tattoan');
                },
                (error) => {
                    this.objPhieuYeuCauGiaCongService.handleError(error);
                }
            )
        );
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
            this.objPhieuYeuCauGiaCongService.findPhieuYeuCauGiaCongs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuYeuCauGiaCongService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];
            e.items.push(
                {
                    text: 'Xem lại',
                    icon: 'rename',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuYeuCauGiaCong = e.row.key as PhieuYeuCauGiaCong;
                        this.openViewModal(rowData);
                    }
                },
                {
                    text: 'In Phiếu Yêu Cầu',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuYeuCauGiaCong = e.row.key as PhieuYeuCauGiaCong;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN PHIẾU YÊU CẦU GIA CÔNG',
                            phieuyeucaugiacong_id: rowData.id,
                            loaiphieuin: 'yeucau'
                        };

                        /* Hiển thị trên modal */
                        this.bsModalRef = this.modalService.show(PhieuYeuCauGiaCongInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'In Phiếu Xuất Hàng Trơn',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuYeuCauGiaCong = e.row.key as PhieuYeuCauGiaCong;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN XUẤT HÀNG TRƠN',
                            phieuyeucaugiacong_id: rowData.id,
                            loaiphieuin: 'hangtron'
                        };

                        /* Hiển thị trên modal */
                        this.bsModalRef = this.modalService.show(PhieuYeuCauGiaCongInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'In Phiếu Tất Toán',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuYeuCauGiaCong = e.row.key as PhieuYeuCauGiaCong;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN TẤT TOÁN',
                            phieuyeucaugiacong_id: rowData.id,
                            loaiphieuin: 'tattoan'
                        };

                        /* Hiển thị trên modal */
                        this.bsModalRef = this.modalService.show(PhieuYeuCauGiaCongInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                }
            );

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            // e.items.push(
            //     {
            //         text: "Cập nhật hoá đơn", icon: "edit", visible: true,
            //         onItemClick: () => {
            //             let rowData: PhieuYeuCauGiaCong = e.row.key as PhieuYeuCauGiaCong;
            //             this.onCapNhatHoaDon(rowData.id, rowData.maphieuxuatkho, rowData.chungtu);
            //         }
            //     }
            // );
        }
    }

    openViewModal(rowData: PhieuYeuCauGiaCong) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU YÊU CẦU',
            isView: 'xemphieu',
            phieuyeucaugiacong_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuYeuCauGiaCongViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuYeuCauGiaCong_id: ${e.key.id}`);
        let rowData: PhieuYeuCauGiaCong = e.key;
        this.openViewModal(rowData);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuYeuCauGiaCongService.deletePhieuYeuCauGiaCong(id).subscribe(
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
                            this.objPhieuYeuCauGiaCongService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
