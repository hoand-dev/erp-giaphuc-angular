import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuDieuChinhKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-dieu-chinh-kho-view-modal/phieu-dieu-chinh-kho-view-modal.component';
import { PhieuNhapChuyenKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-chuyen-kho-view-modal/phieu-nhap-chuyen-kho-view-modal.component';
import { PhieuNhapKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuNhapMuonViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-muon-view-modal/phieu-nhap-muon-view-modal.component';
import { PhieuNhapTraViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-tra-view-modal/phieu-nhap-tra-view-modal.component';
import { PhieuXuatChuyenKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-chuyen-kho-view-modal/phieu-xuat-chuyen-kho-view-modal.component';
import { PhieuXuatKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-kho-view-modal/phieu-xuat-kho-view-modal.component';
import { PhieuXuatMuonViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-muon-view-modal/phieu-xuat-muon-view-modal.component';
import { PhieuXuatTraViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-tra-view-modal/phieu-xuat-tra-view-modal.component';
import { PhieuNhapNhapThanhPhamViewModalComponent } from '@app/modules/san-xuat/modals/phieu-nhap-nhap-thanh-pham-view-modal/phieu-nhap-nhap-thanh-pham-view-modal.component';
import { PhieuXuatKhoGiaCongViewModalComponent } from '@app/modules/san-xuat/modals/phieu-xuat-kho-gia-cong-view-modal/phieu-xuat-kho-gia-cong-view-modal.component';
import { PhieuYeuCauGiaCongViewModalComponent } from '@app/modules/san-xuat/modals/phieu-yeu-cau-gia-cong-view-modal/phieu-yeu-cau-gia-cong-view-modal.component';
import { ThongKeXuatNhapTon_ChiTiet } from '@app/shared/entities';
import { ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-xuat-nhap-ton-chi-tiet-modal',
    templateUrl: './thong-ke-xuat-nhap-ton-chi-tiet-modal.component.html',
    styleUrls: ['./thong-ke-xuat-nhap-ton-chi-tiet-modal.component.css']
})
export class ThongKeXuatNhapTonChiTietModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public bsModalRef_XemPhieu: BsModalRef;

    public title: string;
    public closeBtnName: string;

    public tungay: Date;
    public denngay: Date;

    public chinhanh_id: number;
    public khohang_id: number;
    public hanghoa_id: number;

    public tondauky: number = 0;
    public toncuoiky: number = 0;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - XUẤT NHẬP TỒN CHI TIẾT - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKeXuatNhapTonChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeKhoHangService: ThongKeKhoHangService, private modalService: BsModalService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon_ChiTiet(this.tungay, this.denngay, this.chinhanh_id, this.khohang_id, this.hanghoa_id).subscribe(
                (data) => {
                    let luytien = this.tondauky;
                    data.forEach((value) => {
                        luytien += value.soluongnhap - value.soluongxuat;
                        value.luytien = luytien;
                    });
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        let rowData: ThongKeXuatNhapTon_ChiTiet = e.key as ThongKeXuatNhapTon_ChiTiet;

        /* kiểm tra xem dòng hiện tại là phiếu gì để gọi đúng modal */
        switch (rowData.phieuquery) { // tên lấy từ query db
            case 'nhapkho'://1
                this.onOpenModalNhapKho(rowData);
                break;
            case 'xuatkho'://2
                this.onOpenModalXuatKho(rowData);
                break;
            case 'dieuchinhkho': //3
                this.onOpenModalDieuChinhKho(rowData);
                break;
            case 'xuatchuyenkho': //4
                this.onOpenModalXuatChuyenKho(rowData);
                break;
            case 'nhapchuyenkho': //5
                this.onOpenModalNhapChuyenKho(rowData);
                break;
            case 'xuatkhogiacong': //6
                this.onOpenModalXuatKhoGiaCong(rowData);
                break;
            case 'nhapkhogiacong': //7
                this.onOpenModalNhapKhoGiaCong(rowData);
                break;
            case 'xuatmuonhang': //8
                this.onOpenModalXuatMuonHang(rowData);
                break;
            case 'nhapmuonhang': //9
                this.onOpenModalNhapMuonHang(rowData);
                break;
            case 'xuattramuonhang': //10
                this.onOpenModalXuatTraMuonHang(rowData);
                break;
            case 'nhaptramuonhang': //11
                this.onOpenModalNhapTraMuonHang(rowData);
                break;
            case 'yeucaugiacong': //12
                this.onOpenModalPhieuYeuCauGiaCong(rowData);
                break;

            default:
                console.log('Vui lòng liên hệ admin để được hỗ trợ sớm nhất.');
                break;
        }
    }

    onOpenModalNhapKho(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP KHO',
            isView: 'xemphieu',
            phieunhapkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuNhapKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }

    onOpenModalXuatKho(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT KHO',
            isView: 'xemphieu',
            phieuxuatkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuXuatKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalDieuChinhKho(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU ĐIỀU CHỈNH KHO',
            isView: 'xemphieu',
            phieudieuchinhkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuDieuChinhKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalXuatChuyenKho(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT CHUYỂN KHO',
            isView: 'xemphieu',
            phieuxuatchuyenkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuXuatChuyenKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalNhapChuyenKho(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP CHUYỂN KHO',
            isView: 'xemphieu',
            phieunhapchuyenkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuNhapChuyenKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalXuatKhoGiaCong(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT GIA CÔNG',
            isView: 'xemphieu',
            phieuxuatkhogiacong_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuXuatKhoGiaCongViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalNhapKhoGiaCong(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP THÀNH PHẨM',
            isView: 'xemphieu',
            phieunhapkhogiacong_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuNhapNhapThanhPhamViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalXuatMuonHang(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT MƯỢN HÀNG',
            isView: 'xemphieu',
            phieuxuatmuonhang_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuXuatMuonViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalNhapMuonHang(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP MƯỢN HÀNG',
            isView: 'xemphieu',
            phieunhapmuonhang_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuNhapMuonViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalXuatTraMuonHang(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU TRẢ HÀNG MƯỢN',
            isView: 'xemphieu',
            phieuxuattramuonhang_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuXuatTraViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalNhapTraMuonHang(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP TRẢ MƯỢN HÀNG',
            isView: 'xemphieu',
            phieunhaptramuonhang_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuNhapTraViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }
    onOpenModalPhieuYeuCauGiaCong(rowData: ThongKeXuatNhapTon_ChiTiet) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU YÊU CẦU GIA CÔNG',
            isView: 'xemphieu',
            phieuyeucaugiacong_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRef_XemPhieu = this.modalService.show(PhieuYeuCauGiaCongViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef_XemPhieu.content.closeBtnName = 'Đóng';
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryTonDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.tondauky;
            }
        }
        if (options.name === 'RowsSummaryTonCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.toncuoiky;
            }
        }
    }

    public onConfirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
