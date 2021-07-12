import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PhieuNhapThanhPham } from '@app/shared/entities';
import { ETrangThaiPhieu } from '@app/shared/enums';
import { AppInfoService, CommonService, PhieuNhapThanhPhamService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DanhSachLenhSanXuatModalComponent } from '../../modals/danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';
import { PhieuNhapThanhPhamInPhieuModalComponent } from '../../modals/phieu-nhap-thanh-pham-in-phieu-modal/phieu-nhap-thanh-pham-in-phieu-modal.component';
import { PhieuNhapThanhPhamModalComponent } from '../../modals/phieu-nhap-thanh-pham-modal/phieu-nhap-thanh-pham-modal.component';

@Component({
  selector: 'app-phieu-nhap-thanh-pham',
  templateUrl: './phieu-nhap-thanh-pham.component.html',
  styleUrls: ['./phieu-nhap-thanh-pham.component.css']
})
export class PhieuNhapThanhPhamComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    public subscriptions: Subscription = new Subscription();
    public bsModalRefChild: BsModalRef;
    public bsModalRef: BsModalRef;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - NHẬP THÀNH PHẨM - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuNhapThanhPham'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private phieunhapthanhphamService: PhieuNhapThanhPhamService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('NHẬP THÀNH PHẨM | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieunhapthanhpham-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieunhapthanhpham-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieunhapthanhpham-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieunhapthanhpham-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieunhapthanhpham-xuatdulieu');
                },
                (error) => {
                    this.phieunhapthanhphamService.handleError(error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.phieunhapthanhphamService.findPhieuNhapThanhPhams(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.phieunhapthanhphamService.handleError(error);
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
                    text: 'In Phiếu Nhập Thành Phẩm',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuNhapThanhPham = e.row.key as PhieuNhapThanhPham;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN PHIẾU NHẬP THÀNH PHẨM',
                            phieunhapthanhpham_id: rowData.id,
                            loaiphieuin: 'nhapthanhpham'
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
                },
                {
                    text: 'In Tem Kiện',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuNhapThanhPham = e.row.key as PhieuNhapThanhPham;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN TEM KIỆN',
                            phieunhapthanhpham_id: rowData.id,
                            loaiphieuin: 'temkien'
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
                }

            );
        }
    }

    openViewModal(rowData: PhieuNhapThanhPham) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN - PHIẾU NHẬP THÀNH PHẨM',
            isView: 'view',
            phieunhapthanhpham_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapThanhPhamModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    onRowDblClick(e) {
        console.log(`phieunhapthanhpham_id: ${e.key.id}`);
        let rowData: PhieuNhapThanhPham = e.key;
        this.openViewModal(rowData);
    }

    onAddNew(lenhsanxuat_id: number) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM MỚI - PHIẾU NHẬP THÀNH PHẨM',
            isView: 'view_add',
            lenhsanxuat_id: lenhsanxuat_id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapThanhPhamModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRefChild.content.onClose.subscribe((result) => {
            if (result) {
                this.onLoadData();
            }
        });
    }

    openModal(){
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CHỌN LỆNH SẢN XUẤT',
            trangthainhap: [ETrangThaiPhieu.chuanhap, ETrangThaiPhieu.dangnhap, null]
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(DanhSachLenhSanXuatModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRefChild.content.onClose.subscribe((result) => {
            if (result) {
                this.onAddNew(result.id);
            }
        });
    }

    onRowEdit(id) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CẬP NHẬT - PHIẾU NHẬP THÀNH PHẨM',
            isView: 'view_edit',
            phieunhapthanhpham_id: id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapThanhPhamModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRefChild.content.onClose.subscribe((result) => {
            if (result) {
                this.onLoadData();
            }
        });
    }

    onRowDelete(row) {
        let result = confirm(`<i>Bạn có muốn xóa "${ row.data.maphieu }" này?</i>`, 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.phieunhapthanhphamService.deletePhieuNhapThanhPham(row.data.id).subscribe(
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
                            this.phieunhapthanhphamService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}