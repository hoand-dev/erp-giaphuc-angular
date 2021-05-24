import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, PhieuKhachTraHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuKhachTraHang, PhieuTraHangNCC } from '@app/shared/entities';
import { PhieuTraHangNccViewModalComponent } from '@app/modules/mua-hang/modals/phieu-tra-hang-ncc-view-modal/phieu-tra-hang-ncc-view-modal.component';
import { PhieuKhachTraHangViewModalComponent } from '../../modals/phieu-khach-tra-hang-view-modal/phieu-khach-tra-hang-view-modal.component';

@Component({
    selector: 'app-phieu-khach-tra-hang',
    templateUrl: './phieu-khach-tra-hang.component.html',
    styleUrls: ['./phieu-khach-tra-hang.component.css']
})
export class PhieuKhachTraHangComponent implements OnInit {
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
    public exportFileName: string = '[DANH SÁCH] - PHIẾU KHÁCH TRẢ HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuKhachTraHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuKhachTraHangService: PhieuKhachTraHangService,
        private modalService: BsModalService,
        private authenticationService: AuthenticationService
    ) {
        this.titleService.setTitle('PHIẾU KHÁCH TRẢ HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieukhachtrahang-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieukhachtrahang-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieukhachtrahang-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieukhachtrahang-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieukhachtrahang-xuatdulieu');
                },
                (error) => {
                    this.objPhieuKhachTraHangService.handleError(error);
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
            this.objPhieuKhachTraHangService.findPhieuKhachTraHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuKhachTraHangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        console.log(`objPhieuKhachTraHang_id: ${e.key.id}`);
        let rowData: PhieuKhachTraHang = e.key;
        this.openViewModal(rowData);
    }
    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];
            // Add a custom menu item
            e.items.push({
                text: 'Xem lại',
                icon: 'rename',
                visible: true,
                onItemClick: () => {
                    let rowData: PhieuKhachTraHang = e.row.key as PhieuKhachTraHang;
                    this.openViewModal(rowData);
                }
            });
        }
    }
    openViewModal(rowData: PhieuKhachTraHang) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU TRẢ HÀNG',
            isView: 'xemphieu',
            phieukhachtrahang_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuKhachTraHangViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuKhachTraHangService.deletePhieuKhachTraHang(id).subscribe(
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
                            this.objPhieuKhachTraHangService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
