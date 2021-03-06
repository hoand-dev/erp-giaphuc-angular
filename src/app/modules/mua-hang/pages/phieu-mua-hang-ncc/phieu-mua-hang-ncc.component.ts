import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuMuaHangNCC } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuMuaHangNCCService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { Title } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuMuaHangViewModalComponent } from '../../modals/phieu-mua-hang-view-modal/phieu-mua-hang-view-modal.component';

@Component({
    selector: 'app-phieu-mua-hang-ncc',
    templateUrl: './phieu-mua-hang-ncc.component.html',
    styleUrls: ['./phieu-mua-hang-ncc.component.css']
})
export class PhieuMuaHangNCCComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    public bsModalRef: BsModalRef;

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* tất toán */
    public enableFinish: boolean = false;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU MUA HÀNG NCC - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuMuaHangNCC'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuMuaHangNCCService: PhieuMuaHangNCCService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU MUA HÀNG NCC | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieumuahangncc-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieumuahangncc-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieumuahangncc-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieumuahangncc-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieumuahangncc-xuatdulieu');
                    this.enableFinish = this.commonService.getEnablePermission(this.permissions, 'phieumuahangncc-tattoan');
                },
                (error) => {
                    this.objPhieuMuaHangNCCService.handleError(error);
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
    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // Add a custom menu item
            e.items.push({
                text: 'Xem lại',
                icon: 'rename',
                visible: true,
                onItemClick: () => {
                    let rowData: PhieuMuaHangNCC = e.row.key as PhieuMuaHangNCC;
                    this.openViewModal(rowData);
                }
            });
        }
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuMuaHangNCCService.findPhieuMuaHangNCCs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuMuaHangNCCService.handleError(error);
                }
            )
        );
    }

    openViewModal(rowData: PhieuMuaHangNCC) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU MUA HÀNG',
            isView: 'xemphieu',
            phieumuahangncc_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuMuaHangViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        console.log(`objPhieuMuaHangNCC_id: ${e.key.id}`);
        let rowData: PhieuMuaHangNCC = e.key;
        this.openViewModal(rowData);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuMuaHangNCCService.deletePhieuMuaHangNCC(id).subscribe(
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
                            this.objPhieuMuaHangNCCService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
