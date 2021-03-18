import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ThongKeXuatNhapTon } from '@app/shared/entities';
import { AppInfoService, ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ThongKeXuatNhapTonChiTietModalComponent } from '../../modals/thong-ke-xuat-nhap-ton-chi-tiet-modal/thong-ke-xuat-nhap-ton-chi-tiet-modal.component';
import { ThongKeXuatNhapTonChiTietPhieuModalComponent } from '../../modals/thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal/thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal.component';

@Component({
    selector: 'app-thong-ke-xuat-nhap-ton',
    templateUrl: './thong-ke-xuat-nhap-ton.component.html',
    styleUrls: ['./thong-ke-xuat-nhap-ton.component.css']
})
export class ThongKeXuatNhapTonComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;
    public loadingVisible: boolean = false;

    private subscriptions: Subscription = new Subscription();

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public dataSource_XuatNhapTon: ThongKeXuatNhapTon[];
    public exportFileName: string = '[THỐNG KÊ] - XUẤT NHẬP TỒN - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKe_XuatNhapTon'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private authenticationService: AuthenticationService,
        private objThongKeKhoHangService: ThongKeKhoHangService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle("THỐNG KÊ - XUẤT NHẬP TỒN | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column
            let rowData: ThongKeXuatNhapTon = e.row.key as ThongKeXuatNhapTon;

            // Add a custom menu item
            e.items.push(
                {
                    text: 'Xem chi tiết - Nhập xuất',
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModalChiTiet(rowData);
                    }
                },
                {
                    text: 'Xem chi tiết - Giữ gia công' + ` (${rowData.soluong_giugiacong})`,
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModal_HangGiuLai(rowData, 'giugiacong');
                    }
                },
                {
                    text: 'Xem chi tiết - Giữ bán hàng' + ` (${rowData.soluong_banchuaxuat})`,
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModal_HangGiuLai(rowData, 'giubanhang');
                    }
                },
                {
                    text: 'Xem chi tiết - Giữ chuyển kho' + ` (${rowData.soluong_giuchuyenkho})`,
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModal_HangGiuLai(rowData, 'giuchuyenkho');
                    }
                },
                {
                    text: 'Xem chi tiết - Đặt giữ hàng' + ` (${rowData.soluong_khachdat})`,
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModal_HangGiuLai(rowData, 'datgiuhang');
                    }
                },
                {
                    text: 'Xem chi tiết - Đang về' + ` (${rowData.soluong_muachuanhap})`,
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModal_HangGiuLai(rowData, 'muachuanhap');
                    }
                },
                {
                    text: 'Xem chi tiết - Đang gia công' + ` (${rowData.soluong_thanhphamchuanhap})`,
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModal_HangGiuLai(rowData, 'yeucauchuanhap');
                    }
                }
            );
        }
    }

    openModal_HangGiuLai(rowData: ThongKeXuatNhapTon, view: string) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM CHI TIẾT',
            chinhanh_id: this.authenticationService.currentChiNhanhValue.id,
            khohang_id: rowData.khohang_id,
            hanghoa_id: rowData.hanghoa_id,
            view: view
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(ThongKeXuatNhapTonChiTietPhieuModalComponent, {
            class: 'modal-xl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    openModalChiTiet(rowData: ThongKeXuatNhapTon) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM CHI TIẾT - NHẬP XUẤT',
            tungay: this.firstDayTime,
            denngay: this.currDayTime,
            chinhanh_id: this.authenticationService.currentChiNhanhValue.id,
            khohang_id: rowData.khohang_id,
            hanghoa_id: rowData.hanghoa_id,
            tondauky: rowData.tondauky,
            toncuoiky: rowData.toncuoiky
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(ThongKeXuatNhapTonChiTietModalComponent, {
            class: 'modal-xl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onLoadData() {
        this.loadingVisible = true;
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id, null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                    this.loadingVisible = false;
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                    this.loadingVisible = false;
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }
}
