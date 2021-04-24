import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuCanTruViewModalComponent } from '@app/modules/ke-toan/modals/phieu-can-tru-view-modal/phieu-can-tru-view-modal.component';
import { PhieuChiViewModalComponent } from '@app/modules/ke-toan/modals/phieu-chi-view-modal/phieu-chi-view-modal.component';
import { PhieuThuViewModalComponent } from '@app/modules/ke-toan/modals/phieu-thu-view-modal/phieu-thu-view-modal.component';
import { PhieuNhapKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuNhapNhapThanhPhamViewModalComponent } from '@app/modules/san-xuat/modals/phieu-nhap-nhap-thanh-pham-view-modal/phieu-nhap-nhap-thanh-pham-view-modal.component';
import { ThongKeCongNoDonViGiaCong, ThongKeCongNoDonViGiaCong_ChiTietPhieu } from '@app/shared/entities';
import { ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-don-vi-gia-cong-chi-tiet-cong-no-modal',
    templateUrl: './don-vi-gia-cong-chi-tiet-cong-no-modal.component.html',
    styleUrls: ['./don-vi-gia-cong-chi-tiet-cong-no-modal.component.css']
})
export class DonViGiaCongChiTietCongNoModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public bsModalRefChild: BsModalRef;

    public title: string;
    public closeBtnName: string;

    public tungay: Date;
    public denngay: Date;
    public congnodonvigiacong: ThongKeCongNoDonViGiaCong;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - GIA CÔNG CHI TIẾT CÔNG NỢ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKe_ConNoDonViGiaCong_ChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeCongNoService: ThongKeCongNoService, private modalService: BsModalService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeCongNoService
                .findsCongNo_DonViGiaCong_ChiTietPhieu(this.tungay, this.denngay, this.authenticationService.currentChiNhanhValue.id, this.congnodonvigiacong.donvigiacong_id)
                .subscribe(
                    (data) => {
                        let luytien = this.congnodonvigiacong.nodauky;
                        data.forEach((value) => {
                            luytien += value.tiengiacong - value.tongtienchi + value.tongtienthu;
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
    onRowDblClick(e) {
        let rowData: ThongKeCongNoDonViGiaCong_ChiTietPhieu = e.key as ThongKeCongNoDonViGiaCong_ChiTietPhieu;
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
                this.openModalPhieuNhapThanhPham(rowData);
                break;

            default:
                console.log('Vui lòng liên hệ admin để được hỗ trợ sớm nhất.');
                break;
        }
    }

    onOpenModalPhieuThu(rowData: ThongKeCongNoDonViGiaCong_ChiTietPhieu) {
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

    onOpenModalPhieuCanTru(rowData: ThongKeCongNoDonViGiaCong_ChiTietPhieu) {
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

    onOpenModalPhieuChi(rowData: ThongKeCongNoDonViGiaCong_ChiTietPhieu) {
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

    openModalPhieuNhapThanhPham(rowData: ThongKeCongNoDonViGiaCong_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN PHIẾU NHẬP THÀNH PHẨM',
            isView: 'xemphieu',
            phieunhapkhogiacong_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(PhieuNhapNhapThanhPhamViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
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
