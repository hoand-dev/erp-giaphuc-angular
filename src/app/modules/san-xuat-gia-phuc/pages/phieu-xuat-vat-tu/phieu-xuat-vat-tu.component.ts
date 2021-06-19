import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, PhieuXuatVatTuService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { PhieuXuatVatTuModalComponent } from '../../modals/phieu-xuat-vat-tu-modal/phieu-xuat-vat-tu-modal.component';
import { AuthenticationService } from '@app/_services';
import { DonViGiaCong, HangHoa, KhoHang, PhieuXuatVatTu } from '@app/shared/entities';
import DataSource from 'devextreme/data/data_source';
import { DanhSachLenhSanXuatModalComponent } from '../../modals/danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';

@Component({
    selector: 'app-phieu-xuat-vat-tu',
    templateUrl: './phieu-xuat-vat-tu.component.html',
    styleUrls: ['./phieu-xuat-vat-tu.component.css']
})
export class PhieuXuatVatTuComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public phieuxuatvattu: PhieuXuatVatTu;
    public lstdvgc: DonViGiaCong[] = [];
    public lstKhoXuat: KhoHang[] = [];
    public lstHangHoa: HangHoa[] = [];

    //public dataSource_DVGC: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_HangHoa: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* CHƯA BIẾT LÀM TIẾP SAO....  */

    /* danh sách các quyền theo biến số, mặc định false */
    // public enableAddNew: boolean = false;
    // public enableUpdate: boolean = false;
    // public enableDelete: boolean = false;
    // public enableExport: boolean = false;

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
        private modalService: BsModalService
    ) {
        this.titleService.setTitle(' PHIẾU XUẤT VẬT TƯ | ' + this.appInfoService.appName);
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
                    this.phieuxuatvattuService.handleError(error);
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
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
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
        // chuyển sang view xem chi tiết
        console.log(`phieuxuatvattu_id: ${e.key.id}`);
    }

    onAddNew() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM PHIẾU',
            isView: 'view_add'
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachLenhSanXuatModalComponent, {
            class: 'modal-xl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if (result) {
                this.onLoadData();
            }
        });
    }

    onRowEdit(id) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CẬP NHẬT PHIẾU',
            isView: 'view_edit',
            ipv4_id: id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatVatTuModalComponent, {
            class: 'modal-xl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
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