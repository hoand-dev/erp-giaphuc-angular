import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuXuatKho } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuXuatKhoService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuXuatKhoInPhieuModalComponent } from '../../modals/phieu-xuat-kho-in-phieu-modal/phieu-xuat-kho-in-phieu-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-phieu-xuat-kho',
    templateUrl: './phieu-xuat-kho.component.html',
    styleUrls: ['./phieu-xuat-kho.component.css']
})
export class PhieuXuatKhoComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU XUẤT KHO - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuXuatKho'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuXuatKhoService: PhieuXuatKhoService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle("PHIẾU XUẤT KHO | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieuxuatkho-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkho-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkho-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkho-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkho-xuatdulieu');
                },
                (error) => {
                    this.objPhieuXuatKhoService.handleError(error);
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
            this.objPhieuXuatKhoService.findPhieuXuatKhos(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuXuatKhoService.handleError(error);
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

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push(
                {
                    text: 'Cập nhật hoá đơn',
                    icon: 'edit',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuXuatKho = e.row.key as PhieuXuatKho;
                        this.onCapNhatHoaDon(rowData.id, rowData.maphieuxuatkho, rowData.chungtu);
                    }
                },
                // {
                //     text: 'In phiếu (có giá)',
                //     icon: 'print',
                //     visible: true,
                //     onItemClick: () => {
                //         let rowData: PhieuXuatKho = e.row.key as PhieuXuatKho;
                //         /* khởi tạo giá trị cho modal */
                //         const initialState = {
                //             title: 'XEM IN PHIẾU XUẤT KHO - CÓ GIÁ',
                //             phieuxuatkho_id: rowData.id,
                //             loaiphieuxuat: rowData.loaiphieuxuatkho,
                //             loaiphieuin: 'cogia'
                //         };

                //         /* hiển thị modal */
                //         this.bsModalRef = this.modalService.show(PhieuXuatKhoInPhieuModalComponent, {
                //             class: 'modal-xl modal-dialog-centered',
                //             ignoreBackdropClick: false,
                //             keyboard: false,
                //             initialState
                //         });
                //         this.bsModalRef.content.closeBtnName = 'Đóng';
                //     }
                // },
                {
                    text: 'In phiếu (không giá)',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuXuatKho = e.row.key as PhieuXuatKho;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: 'XEM IN PHIẾU XUẤT KHO -  KHÔNG GIÁ',
                            phieuxuatkho_id: rowData.id,
                            loaiphieuxuat: rowData.loaiphieuxuatkho,
                            loaiphieuin: 'khonggia'
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuXuatKhoInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'In phiếu (Có Giá)',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuXuatKho = e.row.key as PhieuXuatKho;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: 'XEM IN PHIẾU XUẤT KHO - CÓ GIÁ',
                            phieuxuatkho_id: rowData.id,
                            loaiphieuxuat: rowData.loaiphieuxuatkho,
                            loaiphieuin: 'dongiavat'
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuXuatKhoInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
            );
        }
    }

    async onCapNhatHoaDon(id: number, maphieu: string, sohoadon?: string) {
        const { value: soHoaDon } = await Swal.fire({
            title: 'CẬP NHẬT HOÁ ĐƠN',
            input: 'text',
            inputLabel: maphieu,
            inputValue: sohoadon,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Bạn chưa nhập số hoá đơn!';
                }
            }
        });

        if (soHoaDon) {
            this.subscriptions.add(
                this.objPhieuXuatKhoService.updateHoaDonPhieuXuatKho(id, soHoaDon).subscribe(
                    (data) => {
                        if (data) {
                            notify(
                                {
                                    width: 320,
                                    message: 'Cập nhật hoá đơn thành công',
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
                        this.objPhieuXuatKhoService.handleError(error);
                        // load lại dữ liệu
                        this.onLoadData();
                    }
                )
            );
        }
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuXuatKho_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuXuatKhoService.deletePhieuXuatKho(id).subscribe(
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
                            this.objPhieuXuatKhoService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
