import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuNhapKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuXuatKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-kho-view-modal/phieu-xuat-kho-view-modal.component';
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

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push({
                text: 'Xem thông tin phiếu',
                icon: 'rename',
                visible: true,
                onItemClick: () => {
                    let rowData: ThongKeXuatNhapTon_ChiTiet = e.row.key as ThongKeXuatNhapTon_ChiTiet;

                    /* kiểm tra xem dòng hiện tại là phiếu gì để gọi đúng modal */
                    switch (rowData.phieuquery) {
                        case 'nhapkho':
                            this.onOpenModalNhapKho(rowData);
                            break;
                        case 'xuatkho':
                            this.onOpenModalXuatKho(rowData);
                            break;

                        default:
                            console.log('Vui lòng liên hệ admin để được hỗ trợ sớm nhất.');
                            break;
                    }
                }
            });
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
