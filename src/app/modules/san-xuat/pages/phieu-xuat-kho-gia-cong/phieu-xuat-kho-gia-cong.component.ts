import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuXuatKhoGiaCong } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuXuatKhoGiaCongService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuXuatKhoGiaCongInPhieuModalComponent } from '../../modals/phieu-xuat-kho-gia-cong-in-phieu-modal/phieu-xuat-kho-gia-cong-in-phieu-modal.component';
import { Title } from '@angular/platform-browser';
import { PhieuXuatKhoGiaCongViewModalComponent } from '../../modals/phieu-xuat-kho-gia-cong-view-modal/phieu-xuat-kho-gia-cong-view-modal.component';

@Component({
    selector: 'app-phieu-xuat-kho-gia-cong',
    templateUrl: './phieu-xuat-kho-gia-cong.component.html',
    styleUrls: ['./phieu-xuat-kho-gia-cong.component.css']
})
export class PhieuXuatKhoGiaCongComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public exportFileName: string = '[DANH SÁCH] - PHIẾU XUẤT KHO GIA CÔNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuXuatKhoGiaCong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuXuatKhoGiaCongService: PhieuXuatKhoGiaCongService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU XUẤT KHO GIA CÔNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieuxuatkhogiacong-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkhogiacong-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkhogiacong-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkhogiacong-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieuxuatkhogiacong-xuatdulieu');
                },
                (error) => {
                    this.objPhieuXuatKhoGiaCongService.handleError(error);
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
            this.objPhieuXuatKhoGiaCongService.findPhieuXuatKhoGiaCongs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuXuatKhoGiaCongService.handleError(error);
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
                        let rowData: PhieuXuatKhoGiaCong = e.row.key as PhieuXuatKhoGiaCong;
                        this.openViewModal(rowData);
                    }
                },
                {
                    text: 'In Phiếu',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuXuatKhoGiaCong = e.row.key as PhieuXuatKhoGiaCong;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN PHIẾU XUẤT KHO GIA CÔNG',
                            phieuxuatkhogiacong_id: rowData.id
                        };

                        /* Hiển thị trên modal */
                        this.bsModalRef = this.modalService.show(PhieuXuatKhoGiaCongInPhieuModalComponent, {
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

    openViewModal(rowData: PhieuXuatKhoGiaCong) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT KHO GIA CÔNG',
            isView: 'xemphieu',
            phieuxuatkhogiacong_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatKhoGiaCongViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
    onRowDblClick(e) {
        console.log(`objPhieuXuatKhoGiaCong_id: ${e.key.id}`);
        let rowData: PhieuXuatKhoGiaCong = e.key;
        this.openViewModal(rowData);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuXuatKhoGiaCongService.deletePhieuXuatKhoGiaCong(id).subscribe(
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
                            this.objPhieuXuatKhoGiaCongService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
