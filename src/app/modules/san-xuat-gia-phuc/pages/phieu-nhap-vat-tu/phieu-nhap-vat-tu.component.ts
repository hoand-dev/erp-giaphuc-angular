import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, LenhSanXuatService, PhieuNhapVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { PhieuNhapVatTuModalComponent } from '../../modals/phieu-nhap-vat-tu-modal/phieu-nhap-vat-tu-modal.component';
import { DanhSachLenhSanXuatModalComponent } from '../../modals/danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';

@Component({
    selector: 'app-phieu-nhap-vat-tu',
    templateUrl: './phieu-nhap-vat-tu.component.html',
    styleUrls: ['./phieu-nhap-vat-tu.component.css']
})
export class PhieuNhapVatTuComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    public bsModalRefChild: BsModalRef;

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU NHẬP VẬT TƯ   - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_phieuNhapVatTu'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private phieunhapvattuService: PhieuNhapVatTuService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU NHẬP VẬT TƯ | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    // if (!this.commonService.getEnablePermission(this.permissions, 'ipv4-truycap')) {
                    //     this.router.navigate(['/khong-co-quyen']);
                    // }
                    // this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'ipv4-themmoi');
                    // this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'ipv4-capnhat');
                    // this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'ipv4-xoa');
                    // this.enableExport = this.commonService.getEnablePermission(this.permissions, 'ipv4-xuatdulieu');
                },
                (error) => {
                    this.phieunhapvattuService.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.phieunhapvattuService.findPhieuNhapVatTus(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.phieunhapvattuService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM LẠI PHIẾU',
            isView: 'view',
            phieunhapvattu_id: e.key.id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapVatTuModalComponent, {
            class: 'modal-xl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    onAddNew() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CHỌN LỆNH SẢN XUẤT',
            isView: 'view_add'
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
                this.openAddNewModal(result.id);
            }
        });
    }

    onRowEdit(id) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CẬP NHẬT PHIẾU NHẬP VẬT TƯ',
            isView: 'view_edit',
            phieunhapvattu_id: id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapVatTuModalComponent, {
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

    openAddNewModal(lenhsanxuat_id: number) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM PHIẾU NHẬP VẬT TƯ',
            isView: 'view_add',
            lenhsanxuat_id: lenhsanxuat_id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapVatTuModalComponent, {
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

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa danh mục này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.phieunhapvattuService.deletePhieuNhapVatTu(id).subscribe(
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
                            this.phieunhapvattuService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
