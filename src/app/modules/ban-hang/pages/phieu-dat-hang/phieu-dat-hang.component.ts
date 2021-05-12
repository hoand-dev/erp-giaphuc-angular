import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PhieuDatHang } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuDatHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';
import { PhieuKhachDatHangInPhieuModalComponent } from '../../modals';

@Component({
    selector: 'app-phieu-dat-hang',
    templateUrl: './phieu-dat-hang.component.html',
    styleUrls: ['./phieu-dat-hang.component.css']
})
export class PhieuDatHangComponent implements OnInit {
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

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public bsModalRef: BsModalRef;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU KHÁCH ĐẶT HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuDatHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuDatHangService: PhieuDatHangService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU KHÁCH ĐẶT HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieudathang-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieudathang-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieudathang-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieudathang-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieudathang-xuatdulieu');
                    this.enableFinish = this.commonService.getEnablePermission(this.permissions, 'phieudathang-tattoan');
                },
                (error) => {
                    this.objPhieuDatHangService.handleError(error);
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
            this.objPhieuDatHangService.findPhieuDatHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuDatHangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];

            e.items.push(
                // {
                //     text: 'Xem lại',
                //     icon: 'rename',
                //     visible: true,
                //     onItemClick: () => {
                //         let rowData: PhieuBanHang = e.row.key as PhieuBanHang;
                //         this.openViewModal(rowData);
                //     }
                // },
                {
                    text: 'In phiếu đặt hàng',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuDatHang = e.row.key as PhieuDatHang;

                        /*Khởi tạo giá trị modal */
                        const initialState = {
                            title: 'PHIẾU ĐẶT HÀNG SẢN XUẤT',
                            phieudathang_id: rowData.id,
                        };
                        /* Hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuKhachDatHangInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = ' Đóng';
                    }
                }
            );
        }
    }

    // openViewModal(rowData: PhieuBanHang) {
    //     /* khởi tạo giá trị cho modal */
    //     const initialState = {
    //         title: 'THÔNG TIN PHIẾU BÁN HÀNG',
    //         isView: 'xemphieu',
    //         phieubanhang_id: rowData.id
    //     };

    //     /* hiển thị modal */
    //     this.bsModalRef = this.modalService.show(PhieuBanHangViewModalComponent, {
    //         class: 'modal-xxl modal-dialog-centered',
    //         ignoreBackdropClick: false,
    //         keyboard: false,
    //         initialState
    //     });
    //     this.bsModalRef.content.closeBtnName = 'Đóng';
    // }

    onRowDblClick(e) {
        console.log(`objPhieuDatHang_id: ${e.key.id}`);
    }


    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuDatHangService.deletePhieuDatHang(id).subscribe(
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
                            this.objPhieuDatHangService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
