import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeCongNoDonViGiaCong } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DoiChieuCongNoDonViGiaCongModalComponent } from '../../modals/doi-chieu-cong-no-don-vi-gia-cong-modal/doi-chieu-cong-no-don-vi-gia-cong-modal.component';

@Component({
    selector: 'app-thong-ke-cong-no-don-vi-gia-cong',
    templateUrl: './thong-ke-cong-no-don-vi-gia-cong.component.html',
    styleUrls: ['./thong-ke-cong-no-don-vi-gia-cong.component.css']
})
export class ThongKeCongNoDonViGiaCongComponent implements OnInit, OnDestroy {
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

    public dataSource_CongNoDonViGiaCong: ThongKeCongNoDonViGiaCong[];
    public exportFileName: string = '[THỐNG KÊ] - CÔNG NỢ ĐƠN VỊ GIA CÔNG - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeCongNo_DonViGiaCong'
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
        this.titleService.setTitle('THỐNG KÊ - CÔNG NỢ ĐƠN VỊ GIA CÔNG | ' + this.appInfoService.appName);
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
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkecongno-donvigiacong')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkecongno-donvigiacong-xuatdulieu');
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
            this.objThongKeCongNoService.findsCongNo_DonViGiaCong(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    // tính luỹ tiến theo từng khách hàng
                    let luytien: number = 0;
                    let madonvigiacong: string = null;
                    data.forEach((value) => {
                        if (madonvigiacong == value.madonvigiacong) {
                            luytien += value.tiengiacong - value.tongtienchi + value.tongtienthu;
                        } else {
                            madonvigiacong = value.madonvigiacong;
                            luytien = value.nodauky + value.tiengiacong - value.tongtienchi + value.tongtienthu;
                        }
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

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push({
                text: 'Đối chiếu công nợ',
                icon: 'print',
                visible: true,
                onItemClick: () => {
                    let rowData: ThongKeCongNoDonViGiaCong = e.row.key as ThongKeCongNoDonViGiaCong;
                    this.openModal(rowData, 1);
                }
            });
        }
    }

    openModal(congnodonvigiacong: ThongKeCongNoDonViGiaCong, mauin: number) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM IN ĐỐI CHIẾU CÔNG NỢ - MẪU ' + mauin,
            tungay: this.firstDayTime,
            denngay: this.currDayTime,
            congnodonvigiacong: congnodonvigiacong,
            mauin: mauin
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DoiChieuCongNoDonViGiaCongModalComponent, {
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
                if(!this.dau.includes(options.value.madonvigiacong)){
                    options.totalValue += options.value.nodauky;
                    this.dau.push(options.value.madonvigiacong);
                }
            }
        }
        if (options.name === 'RowsSummaryNoCuoiKyTotal') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if(!this.cuoi.includes(options.value.madonvigiacong)){
                    options.totalValue += options.value.nocuoiky;
                    this.cuoi.push(options.value.madonvigiacong);
                }
            }
        }
        if (options.name === 'RowsSummaryCongNoHienTaiTotal') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                if(!this.hientai.includes(options.value.madonvigiacong)){
                    options.totalValue += options.value.congnohientai;
                    this.hientai.push(options.value.madonvigiacong);
                }
            }
        }
    }
}
