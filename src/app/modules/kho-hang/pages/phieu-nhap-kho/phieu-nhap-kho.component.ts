import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuNhapKho } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuNhapKhoService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuNhapKhoInPhieuModalComponent } from '../../modals/phieu-nhap-kho-in-phieu-modal/phieu-nhap-kho-in-phieu-modal.component';
import { Title } from '@angular/platform-browser';
import { PhieuNhapKhoViewModalComponent } from '../../modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';

@Component({
    selector: 'app-phieu-nhap-kho',
    templateUrl: './phieu-nhap-kho.component.html',
    styleUrls: ['./phieu-nhap-kho.component.css']
})
export class PhieuNhapKhoComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

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
    public exportFileName: string = '[DANH SÁCH] - PHIẾU NHẬP KHO - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuNhapKho'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuNhapKhoService: PhieuNhapKhoService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU NHẬP KHO | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieunhapkho-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieunhapkho-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieunhapkho-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieunhapkho-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieunhapkho-xuatdulieu');
                },
                (error) => {
                    this.objPhieuNhapKhoService.handleError(error);
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

    rowNumber(rowIndex) {
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
                    text: 'Xem lại',
                    icon: 'rename',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuNhapKho = e.row.key as PhieuNhapKho;
                        this.openViewModal(rowData);
                    }
                },
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
    openViewModal(rowData: PhieuNhapKho) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP KHO',
            isView: 'xemphieu',
            phieunhapkho_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuNhapKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onRowDblClick(e) {
        console.log(`objPhieuNhapKho_id: ${e.key.id}`);
        let rowData: PhieuNhapKho = e.key;
        this.openViewModal(rowData);
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
