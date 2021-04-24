import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuCanTruViewModalComponent } from '@app/modules/ke-toan/modals/phieu-can-tru-view-modal/phieu-can-tru-view-modal.component';
import { PhieuChiViewModalComponent } from '@app/modules/ke-toan/modals/phieu-chi-view-modal/phieu-chi-view-modal.component';
import { PhieuThuViewModalComponent } from '@app/modules/ke-toan/modals/phieu-thu-view-modal/phieu-thu-view-modal.component';
import { PhieuNhapKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuXuatKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-kho-view-modal/phieu-xuat-kho-view-modal.component';
import { ThongKeCongNoDonViGiaCong, ThongKeCongNoNhaCungCap, ThongKeCongNoNhaCungCap_ChiTietPhieu } from '@app/shared/entities';
import { ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-nha-cung-cap-chi-tiet-cong-no-modal',
    templateUrl: './nha-cung-cap-chi-tiet-cong-no-modal.component.html',
    styleUrls: ['./nha-cung-cap-chi-tiet-cong-no-modal.component.css']
})
export class NhaCungCapChiTietCongNoModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public bsModalRefChild: BsModalRef;

    public title: string;
    public closeBtnName: string;

    public tungay: Date;
    public denngay: Date;
    public congnodonvigiacong: ThongKeCongNoNhaCungCap;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - NHÀ CUNG CẤP CHI TIẾT CÔNG NỢ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKe_ConNoNhaCungCap_ChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeCongNoService: ThongKeCongNoService, private modalService: BsModalService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }
    onRowDblClick(e) {
        let rowData: ThongKeCongNoNhaCungCap_ChiTietPhieu = e.key as ThongKeCongNoNhaCungCap_ChiTietPhieu;
        /* kiểm tra xem dòng hiện tại là phiếu gì để gọi đúng modal */
        switch (rowData.phieuquery) {
            case 'phieuthu':
                this.onOpenModalPhieuThu(rowData);
                break;
            case 'phieucantru':
                this.onOpenModalPhieuCanTru(rowData);
                break;
            case 'phieuchi':
                this.onOpenModalPhieuChi(rowData);
                break;
            case 'phieunhapkho':
                this.openModalPhieuNhapKho(rowData);
                break;
            case 'phieuxuatkho':
                this.openModalPhieuXuatKho(rowData);
                break;

            default:
                console.log('Vui lòng liên hệ admin để được hỗ trợ sớm nhất.');
                break;
        }
    }

    onOpenModalPhieuThu(rowData: ThongKeCongNoNhaCungCap_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU THU',
            isView: 'xemphieu',
            phieuthu_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuThuViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    onOpenModalPhieuCanTru(rowData: ThongKeCongNoNhaCungCap_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU CẤN TRỪ',
            isView: 'xemphieu',
            phieucantru_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuCanTruViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    onOpenModalPhieuChi(rowData: ThongKeCongNoNhaCungCap_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU CHI',
            isView: 'xemphieu',
            phieuchi_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuChiViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    openModalPhieuNhapKho(rowData: ThongKeCongNoNhaCungCap_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP KHO',
            isView: 'xemphieu',
            phieunhapkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    openModalPhieuXuatKho(rowData: ThongKeCongNoNhaCungCap_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU XUẤT KHO',
            isView: 'xemphieu',
            phieuxuatkho_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuXuatKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeCongNoService
                .findsCongNo_NhaCungCap_ChiTietPhieu(this.tungay, this.denngay, this.authenticationService.currentChiNhanhValue.id, this.congnodonvigiacong.nhacungcap_id)
                .subscribe(
                    (data) => {
                        let luytien = this.congnodonvigiacong.nodauky;
                        data.forEach((value) => {
                            luytien += value.tongtienmua - value.tongtientra - value.tongtienchi + value.tongtienthu;
                            value.luytien = luytien;
                        });
                        this.dataGrid.dataSource = data;
                    },
                    (error) => {
                        this.objThongKeCongNoService.handleError(error);
                    }
                )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryTonDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.congnodonvigiacong.nodauky;
            }
        }
        if (options.name === 'RowsSummaryTonCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.congnodonvigiacong.nocuoiky;
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
