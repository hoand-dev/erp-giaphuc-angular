import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, LenhSanXuatService, PhieuXuatVatTuService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { PhieuXuatVatTuModalComponent } from '../../modals/phieu-xuat-vat-tu-modal/phieu-xuat-vat-tu-modal.component';
import { AuthenticationService } from '@app/_services';
import { DonViGiaCong, HangHoa, KhoHang, PhieuXuatVatTu, PhieuXuatVatTu_ChiTiet } from '@app/shared/entities';
import DataSource from 'devextreme/data/data_source';
import { DanhSachLenhSanXuatModalComponent } from '../../modals/danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';
import { ETrangThaiPhieu } from '@app/shared/enums';
import { PhieuXuatVatTuInPhieuModalComponent } from '../../modals/phieu-xuat-vat-tu-in-phieu-modal/phieu-xuat-vat-tu-in-phieu-modal.component';

@Component({
    selector: 'app-phieu-xuat-vat-tu',
    templateUrl: './phieu-xuat-vat-tu.component.html',
    styleUrls: ['./phieu-xuat-vat-tu.component.css']
})
export class PhieuXuatVatTuComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    public bsModalRefChild: BsModalRef;
    public bsModalRef: BsModalRef;

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public phieuxuatvattu: PhieuXuatVatTu;
    public lstdvgc: DonViGiaCong[] = [];
    public lstKhoXuat: KhoHang[] = [];
    public lstHangHoa: HangHoa[] = [];

    public hanghoas: PhieuXuatVatTu_ChiTiet[] = [];

    //public dataSource_DVGC: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_HangHoa: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU XUẤT VẬT TƯ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuXuatVatTu'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private phieuxuatvattuService: PhieuXuatVatTuService,
        private modalService: BsModalService,
        public lenhsanxuatService: LenhSanXuatService
    ) {
        this.titleService.setTitle(' PHIẾU XUẤT VẬT TƯ | ' + this.appInfoService.appName);
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
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieuxuatvattu-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieuxuatvattu-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieuxuatvattu-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieuxuatvattu-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieuxuatvattu-xuatdulieu');
                },
                (error) => {
                    this.phieuxuatvattuService.handleError(error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];
            e.items.push(
                {
                    text: 'In Phiếu Xuất Vật Tư',
                    icon: 'print',
                    visible: 'true',

                    onItemClick: () => {
                        let rowData: PhieuXuatVatTu = e.row.key as PhieuXuatVatTu;

                        /*Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'IN PHIẾU XUẤT VẬT TƯ',
                            phieuxuatvattu_id: rowData.id
                        };

                        /* Hiển thị trên modal */
                        this.bsModalRef = this.modalService.show(PhieuXuatVatTuInPhieuModalComponent, {
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


    onLoadData() {
        this.subscriptions.add(
            this.phieuxuatvattuService.findPhieuXuatVatTus(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.phieuxuatvattuService.handleError(error);
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
            phieuxuatvattu_id: e.key.id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuXuatVatTuModalComponent, {
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
            title: 'CẬP NHẬT - PHIẾU XUẤT VẬT TƯ',
            isView: 'view_edit',
            phieuxuatvattu_id: id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuXuatVatTuModalComponent, {
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

    openAddNewModal(lenhsanxuat_id: number){
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM MỚI - PHIẾU XUẤT VẬT TƯ',
            isView: 'view_add',
            lenhsanxuat_id: lenhsanxuat_id
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuXuatVatTuModalComponent, {
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
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.phieuxuatvattuService.deletePhieuXuatVatTu(id).subscribe(
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
                            this.phieuxuatvattuService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
