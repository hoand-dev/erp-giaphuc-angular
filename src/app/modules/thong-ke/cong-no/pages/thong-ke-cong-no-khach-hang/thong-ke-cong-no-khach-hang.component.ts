import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeCongNoKhachHang } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DoiChieuCongNoKhachHangModalComponent } from '../../modals/doi-chieu-cong-no-khach-hang-modal/doi-chieu-cong-no-khach-hang-modal.component';
import { KhachHangChiTietCongNoModalComponent } from '../../modals/khach-hang-chi-tiet-cong-no-modal/khach-hang-chi-tiet-cong-no-modal.component';

@Component({
    selector: 'app-thong-ke-cong-no-khach-hang',
    templateUrl: './thong-ke-cong-no-khach-hang.component.html',
    styleUrls: ['./thong-ke-cong-no-khach-hang.component.css']
})
export class ThongKeCongNoKhachHangComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;

    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    public dataSource_CongNoKhachHang: ThongKeCongNoKhachHang[];
    public exportFileName: string = '[THỐNG KÊ] - CÔNG NỢ KHÁCH HÀNG - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeCongNo_KhachHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeCongNoService: ThongKeCongNoService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('THỐNG KÊ - CÔNG NỢ KHÁCH HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();
        
        this.calculateSummary = this.calculateSummary.bind(this);
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkecongno-khachhang')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkecongno-khachhang-xuatdulieu');
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
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

    onLoadData() {
        // gọi service lấy dữ liệu báo cáo
        this.subscriptions.add(
            this.objThongKeCongNoService.findsCongNo_KhachHang(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    // tính luỹ tiến theo từng khách hàng
                    // let luytien: number = 0;
                    // let makhachhang: string = null;
                    // data.forEach((value) => {
                    //     if (makhachhang == value.makhachhang) {
                    //         luytien += value.tongtienban - value.tongtientra - value.tongtienthu + value.tongtienchi;
                    //     } else {
                    //         makhachhang = value.makhachhang;
                    //         luytien = value.nodauky + value.tongtienban - value.tongtientra - value.tongtienthu + value.tongtienchi;
                    //     }
                    //     value.luytien = luytien;
                    // });
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push(
                {
                    text: 'Chi tiết công nợ',
                    icon: 'rename',
                    visible: true,
                    onItemClick: () => {
                        let rowData: ThongKeCongNoKhachHang = e.row.key as ThongKeCongNoKhachHang;
                        this.openModalChiTietPhieu(rowData);
                    }
                },
                {
                    text: 'Đối chiếu công nợ - Mẫu 1',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: ThongKeCongNoKhachHang = e.row.key as ThongKeCongNoKhachHang;
                        this.openModal(rowData, 1);
                    }
                },
                {
                    text: 'Đối chiếu công nợ - Mẫu 2',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: ThongKeCongNoKhachHang = e.row.key as ThongKeCongNoKhachHang;
                        this.openModal(rowData, 2);
                    }
                },
                {
                    text: 'Đối chiếu công nợ - Mẫu 3',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: ThongKeCongNoKhachHang = e.row.key as ThongKeCongNoKhachHang;
                        this.openModal(rowData, 3);
                    }
                },
                {
                    text: 'Đối chiếu công nợ - Mẫu 4',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: ThongKeCongNoKhachHang = e.row.key as ThongKeCongNoKhachHang;
                        this.openModal(rowData, 4);
                    }
                }
            );
        }
    }

    openModalChiTietPhieu(congnodonvigiacong: ThongKeCongNoKhachHang) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `KHÁCH HÀNG - CHI TIẾT CÔNG NỢ: "${congnodonvigiacong.makhachhang}"`,
            tungay: this.firstDayTime,
            denngay: this.currDayTime,
            congnodonvigiacong: congnodonvigiacong
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(KhachHangChiTietCongNoModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    openModal(congnokhachhang: ThongKeCongNoKhachHang, mauin: number) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM IN ĐỐI CHIẾU CÔNG NỢ - MẪU ' + mauin,
            tungay: this.firstDayTime,
            denngay: this.currDayTime,
            congnokhachhang: congnokhachhang,
            mauin: mauin
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DoiChieuCongNoKhachHangModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    customizeText(rowData) {
        return null;
    }

    onOptionChanged(e){
        // thay đổi bộ lọc hoặc tìm kiếm gán lại giá trị để tính tổng cộng
        this.dau = [];
        this.cuoi = [];
        this.hientai = [];
    }

    dau: string[] = [];
    cuoi: string[] = [];
    hientai: string[] = [];

    calculateSummary(options) {
        if (options.name === 'RowsSummaryMaKhachHang') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.makhachhang;
            }
        }
        if (options.name === 'RowsSummaryNoDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.nodauky;
            }
        }
        if (options.name === 'RowsSummaryNoCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.nocuoiky;
            }
        }
        if (options.name === 'RowsSummaryCongNoHienTai') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.congnohientai;
            }
        }

        if (options.name === 'RowsSummaryNoDauKyTotal') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if(!this.dau.includes(options.value.makhachhang)){
                    options.totalValue += options.value.nodauky;
                    this.dau.push(options.value.makhachhang);
                }
            }
        }
        if (options.name === 'RowsSummaryNoCuoiKyTotal') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if(!this.cuoi.includes(options.value.makhachhang)){
                    options.totalValue += options.value.nocuoiky;
                    this.cuoi.push(options.value.makhachhang);
                }
            }
        }
        if (options.name === 'RowsSummaryCongNoHienTaiTotal') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if(!this.hientai.includes(options.value.makhachhang)){
                    options.totalValue += options.value.congnohientai;
                    this.hientai.push(options.value.makhachhang);
                }
            }
        }
    }
}
