import { Component, OnInit, ViewChild } from '@angular/core';
import { LenhVayViewModalComponent } from '@app/modules/ke-toan/modals/lenh-vay-view-modal/lenh-vay-view-modal.component';
import { PhieuCanTruViewModalComponent } from '@app/modules/ke-toan/modals/phieu-can-tru-view-modal/phieu-can-tru-view-modal.component';
import { PhieuChiViewModalComponent } from '@app/modules/ke-toan/modals/phieu-chi-view-modal/phieu-chi-view-modal.component';
import { PhieuThuViewModalComponent } from '@app/modules/ke-toan/modals/phieu-thu-view-modal/phieu-thu-view-modal.component';
import { ThongKeNoiDungThuChi, ThongKeThuChiTonQuy, ThongKeThuChiTonQuy_ChiTietPhieu } from '@app/shared/entities';
import { ThongKeThuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-thong-ke-chi-tiet-ton-quy-modal',
  templateUrl: './thong-ke-chi-tiet-ton-quy-modal.component.html',
  styleUrls: ['./thong-ke-chi-tiet-ton-quy-modal.component.css']
})
export class ThongKeChiTietTonQuyComponent  implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public bsModalRefChild: BsModalRef;

    public title: string;
    public closeBtnName: string;

    public tungay: Date;
    public denngay: Date;
    public thongkethuchitonquy: ThongKeThuChiTonQuy;
    public thongkenoidungthuchi: ThongKeNoiDungThuChi;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - THU CHI TỒN QUỸ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKe_ThuChiTonQuy_ChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeThuChi: ThongKeThuChiService, private modalService: BsModalService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeThuChi
                .findsThuChi_TonQuy_ChiTiet(this.tungay, this.denngay, this.authenticationService.currentChiNhanhValue.id, this.thongkethuchitonquy.quy_id)
                .subscribe(
                    (data) => {
                        let luytien = this.thongkethuchitonquy.tondauky;
                        data.forEach((value) => {
                            // luytien += value.sotienthu - value.sotienchi - value.tongtienthu + value.tongtienchi;
                            // value.luytien = luytien; - quỹ không hiện lũy tiến nữa
                        });
                        this.dataGrid.dataSource = data;
                    },
                    (error) => {
                        this.objThongKeThuChi.handleError(error);
                    }
                )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        let rowData: ThongKeThuChiTonQuy_ChiTietPhieu = e.key as ThongKeThuChiTonQuy_ChiTietPhieu;
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
            case 'lenhvay':
                    this.onOpenModalLenhVay(rowData);
                    break;

            default:
                console.log('Vui lòng liên hệ admin để được hỗ trợ sớm nhất.');
                break;
        }
    }

    onOpenModalPhieuThu(rowData: ThongKeThuChiTonQuy_ChiTietPhieu) {
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

    onOpenModalPhieuCanTru(rowData: ThongKeThuChiTonQuy_ChiTietPhieu) {
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

    onOpenModalPhieuChi(rowData: ThongKeThuChiTonQuy_ChiTietPhieu) {
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

    onOpenModalLenhVay(rowData: ThongKeThuChiTonQuy_ChiTietPhieu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN LỆNH VAY',
            isView: 'xemphieu',
            lenhvay_id: rowData.idphieu
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(LenhVayViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';
    }


    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryTonDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.thongkethuchitonquy.tondauky;
            }
        }
        if (options.name === 'RowsSummaryTonCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.thongkethuchitonquy.toncuoiky;
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
