import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuXuatMuonHang } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuXuatMuonHangService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuXuatMuonHangInPhieuModalComponent } from '../../modals/phieu-xuat-muon-hang-in-phieu-modal/phieu-xuat-muon-hang-in-phieu-modal.component';
import { Title } from '@angular/platform-browser';
import { PhieuXuatMuonViewModalComponent } from '../../modals/phieu-xuat-muon-view-modal/phieu-xuat-muon-view-modal.component';

@Component({
    selector: 'app-phieu-xuat-muon-hang',
    templateUrl: './phieu-xuat-muon-hang.component.html',
    styleUrls: ['./phieu-xuat-muon-hang.component.css']
})
export class PhieuXuatMuonHangComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public exportFileName: string = '[DANH SÁCH] - PHIẾU XUẤT MƯỢN HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuXuatMuonHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuXuatMuonHangService: PhieuXuatMuonHangService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU XUẤT MƯỢN HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieuxuatmuon-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieuxuatmuon-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieuxuatmuon-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieuxuatmuon-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieuxuatmuon-xuatdulieu');
                },
                (error) => {
                    this.objPhieuXuatMuonHangService.handleError(error);
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
            this.objPhieuXuatMuonHangService.findPhieuXuatMuonHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuXuatMuonHangService.handleError(error);
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
                        let rowData: PhieuXuatMuonHang = e.row.key as PhieuXuatMuonHang;
                        this.openViewModal(rowData);
                    }
                },
                {
                    text: 'In phiếu',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuXuatMuonHang = e.row.key as PhieuXuatMuonHang;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: 'XEM IN PHIẾU XUẤT MƯỢN HÀNG',
                            phieuxuatmuonhang_id: rowData.id
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuXuatMuonHangInPhieuModalComponent, {
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

    openViewModal(rowData: PhieuXuatMuonHang) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT MƯỢN',
            isView: 'xemphieu',
            phieuxuatmuonhang_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatMuonViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onRowDblClick(e) {
        console.log(`objPhieuXuatMuonHang_id: ${e.key.id}`);
        let rowData: PhieuXuatMuonHang = e.key;
        this.openViewModal(rowData);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuXuatMuonHangService.deletePhieuXuatMuonHang(id).subscribe(
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
                            this.objPhieuXuatMuonHangService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
