import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeXuatNhapTonLoHang } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ThongKeXuatNhapTonChiTietModalComponent } from '../../modals/thong-ke-xuat-nhap-ton-chi-tiet-modal/thong-ke-xuat-nhap-ton-chi-tiet-modal.component';
import { ThongKeXuatNhapTonChiTietPhieuModalComponent } from '../../modals/thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal/thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal.component';

@Component({
  selector: 'app-thong-ke-xuat-nhap-ton-lo-hang',
  templateUrl: './thong-ke-xuat-nhap-ton-lo-hang.component.html',
  styleUrls: ['./thong-ke-xuat-nhap-ton-lo-hang.component.css']
})
export class ThongKeXuatNhapTonLoHangComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;
    public loadingVisible: boolean = false;

    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = true;
    public enableUpdate: boolean = true;
    public enableDelete: boolean = true;
    public enableExport: boolean = true;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public lblTimeView: string = null;
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public dataSource_XuatNhapTonLoHang: ThongKeXuatNhapTonLoHang[];
    public exportFileName: string = '[THỐNG KÊ] - XUẤT NHẬP TỒN LÔ HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKe_XuatNhapTonLoHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeKhoHangService: ThongKeKhoHangService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('THỐNG KÊ - XUẤT NHẬP TỒN LÔ HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')
        
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    // this.permissions = data;
                    // if (!this.commonService.getEnablePermission(this.permissions, 'thongkekho-xuatnhaptonlohang')) {
                    //     this.router.navigate(['/khong-co-quyen']);
                    // }

                    // this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkekho-xuatnhaptonlohang-xuatdulieu');
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                }
            )
        );

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
            let rowData: ThongKeXuatNhapTonLoHang = e.row.key as ThongKeXuatNhapTonLoHang;

            // Add a custom menu item
            e.items.push(
                {
                    text: 'Xem chi tiết lô - Nhập xuất',
                    icon: 'view',
                    visible: true,
                    onItemClick: () => {
                        this.openModalChiTiet(rowData);
                    }
                },
            );
        }
    }

    openModal_HangGiuLai(rowData: ThongKeXuatNhapTonLoHang, view: string) {
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
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    openModalChiTiet(rowData: ThongKeXuatNhapTonLoHang) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM CHI TIẾT LÔ - NHẬP XUẤT',
            tungay: this.firstDayTime,
            denngay: this.currDayTime,
            chinhanh_id: this.authenticationService.currentChiNhanhValue.id,
            khohang_id: rowData.khohang_id,
            hanghoa_id: rowData.hanghoa_id,
            hanghoa_lohang_id: rowData.hanghoa_lohang_id,
            tondauky: rowData.tondauky,
            toncuoiky: rowData.toncuoiky
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(ThongKeXuatNhapTonChiTietModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onLoadData() {
        this.loadingVisible = true;
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon_LoHang(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id, null, null).subscribe(
                (data) => {
                    this.lblTimeView = 'Từ ngày: ' + moment(this.firstDayTime).format('DD/MM/YYYY') + ' - Đến ngày: ' + moment(this.currDayTime).format('DD/MM/YYYY');
                    if(moment(this.firstDayTime).format('DD/MM/YYYY') === moment(this.currDayTime).format('DD/MM/YYYY')){
                        this.lblTimeView = 'Trong ngày: ' + moment(this.firstDayTime).format('DD/MM/YYYY');
                    }
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

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }
}