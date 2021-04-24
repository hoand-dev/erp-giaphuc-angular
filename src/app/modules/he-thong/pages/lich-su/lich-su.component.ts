import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LichSu, PhieuDatHangNCC } from '@app/shared/entities';
import { AppInfoService, CommonService, LichSuService, PhieuDatHangNCCService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm, custom } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

import { ELichSu } from '@app/shared/enums';
import { PhieuNhapKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuXuatKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-kho-view-modal/phieu-xuat-kho-view-modal.component';
import { PhieuDieuChinhKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-dieu-chinh-kho-view-modal/phieu-dieu-chinh-kho-view-modal.component';
import { PhieuXuatChuyenKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-chuyen-kho-view-modal/phieu-xuat-chuyen-kho-view-modal.component';
import { PhieuNhapChuyenKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-chuyen-kho-view-modal/phieu-nhap-chuyen-kho-view-modal.component';
import { PhieuNhapMuonViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-muon-view-modal/phieu-nhap-muon-view-modal.component';
import { PhieuXuatMuonViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-muon-view-modal/phieu-xuat-muon-view-modal.component';
import { PhieuNhapTraViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-tra-view-modal/phieu-nhap-tra-view-modal.component';
import { PhieuXuatTraViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-tra-view-modal/phieu-xuat-tra-view-modal.component';
import { LenhVayViewModalComponent } from '@app/modules/ke-toan/modals/lenh-vay-view-modal/lenh-vay-view-modal.component';
import { PhieuThuViewModalComponent } from '@app/modules/ke-toan/modals/phieu-thu-view-modal/phieu-thu-view-modal.component';
import { PhieuChiViewModalComponent } from '@app/modules/ke-toan/modals/phieu-chi-view-modal/phieu-chi-view-modal.component';
import { PhieuCanTruViewModalComponent } from '@app/modules/ke-toan/modals/phieu-can-tru-view-modal/phieu-can-tru-view-modal.component';

@Component({
    selector: 'app-lich-su',
    templateUrl: './lich-su.component.html',
    styleUrls: ['./lich-su.component.css']
})
export class LichSuComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public enableReView: boolean = false;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - LỊCH SỬ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_LichSuHeThong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private lichsuService: LichSuService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('LỊCH SỬ | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = moment().toDate(); //new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;

                    if (!this.commonService.getEnablePermission(this.permissions, 'lichsu-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableReView = this.commonService.getEnablePermission(this.permissions, 'lichsu-xemlaiphieu');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'lichsu-xuatdulieu');
                },
                (error) => {
                    this.lichsuService.handleError(error);
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

        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.lichsuService.finds(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.lichsuService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // double click xem thông tin phiếu
        let row: LichSu = e.key;

        switch (row.log_chucnang) {
            case ELichSu.DATHANGNCC:
                break;
            case ELichSu.MUAHANGNCC:
                break;
            case ELichSu.TRAHANGNCC:
                break;

            case ELichSu.HOPDONG:
                break;
            case ELichSu.BANGGIA:
                break;
            case ELichSu.DATHANG:
                break;
            case ELichSu.BANHANG:
                break;
            case ELichSu.TRAHANG:
                break;

            case ELichSu.NHAPKHO:
                this.showModalNhapKho(row);
                break;
            case ELichSu.XUATKHO:
                this.showModalXuatKho(row);
                break;
            case ELichSu.DIEUCHINHKHO:
                this.showModalDieuChinhKho(row);
                break;
            case ELichSu.XUATCHUYENKHO:
                this.showModalXuatChuyenKho(row);
                break;
            case ELichSu.NHAPCHUYENKHO:
                this.showModalNhapChuyenKho(row);
                break;

            case ELichSu.NHAPMUONHANG:
                this.showModalNhapMuonHang(row);
                break;
            case ELichSu.XUATMUONHANG:
                this.showModalXuatMuonHang(row);
                break;
            case ELichSu.XUATTRAMUONHANG:
                this.showModalXuatTraMuonHang(row);
                break;
            case ELichSu.NHAPTRAMUONHANG:
                this.showModalNhapTraMuonHang(row);
                break;

            case ELichSu.LENHVAY:
                this.showModalLenhVay(row);
                break;
            case ELichSu.PHIEUTHU:
                this.showModalThu(row);
                break;
            case ELichSu.PHIEUCHI:
                this.showModalChi(row);
                break;
            case ELichSu.PHIEUCANTRU:
                this.showModalCanTru(row);
                break;

            case ELichSu.BANGGIAGIACONG:
                break;
            case ELichSu.XUATKHOGIACONG:
                break;
            case ELichSu.YEUCAUGIACONG:
                break;
            case ELichSu.NHAPTHANHPHAM:
                break;

            default:
                break;
        }
    }

    showModalNhapKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU NHẬP KHO: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieunhapkho_id: x.id
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

    showModalXuatKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU XUẤT KHO: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieuxuatkho_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalDieuChinhKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU ĐIỀU CHỈNH: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieudieuchinhkho_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuDieuChinhKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalXuatChuyenKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU XUẤT CHUYỂN: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieuxuatchuyenkho_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatChuyenKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalNhapChuyenKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU NHẬP CHUYỂN: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieunhapchuyenkho_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuNhapChuyenKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
    
    showModalNhapMuonHang(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU NHẬP MƯỢN HÀNG: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieunhapmuonhang_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuNhapMuonViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
    
    showModalXuatMuonHang(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU XUẤT CHO MƯỢN: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieuxuatmuonhang_id: x.id
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

    showModalNhapTraMuonHang(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU NHẬP TRẢ: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieunhaptramuonhang_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuNhapTraViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalXuatTraMuonHang(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU XUẤT TRẢ: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieuxuattramuonhang_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatTraViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
    
    showModalLenhVay(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN LỆNH VAY: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            lenhvay_id: x.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(LenhVayViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalThu(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU THU: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieuthu_id: x.id
        };
    
        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuThuViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalChi(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU CHI: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieuchi_id: x.id
        };
    
        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuChiViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalCanTru(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU CẤN TRỪ: ${moment(x.log_thoigianthaotac).format('HH:mm DD/MM/YYYY')} - ${x.nguoithaotac} - ${x.log_noidung}`,
            isView: 'xemlichsu',
            phieucantru_id: x.id
        };
    
        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuCanTruViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
}
