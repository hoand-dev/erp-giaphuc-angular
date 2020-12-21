import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThongKeCongNoKhachHang } from '@app/shared/entities';
import { ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-cong-no-khach-hang',
    templateUrl: './thong-ke-cong-no-khach-hang.component.html',
    styleUrls: ['./thong-ke-cong-no-khach-hang.component.css']
})
export class ThongKeCongNoKhachHangComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    public dataSource_CongNoKhachHang: ThongKeCongNoKhachHang[];
    public exportFileName: string = '[THỐNG KÊ] - Công nợ khách hàng - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeCongNo_KhachHang'
    };

    constructor(
        private authenticationService: AuthenticationService, 
        private objThongKeCongNoService: ThongKeCongNoService
    ) {}

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh
                .subscribe((x) => {
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
                    let luytien: number = 0;
                    let makhachhang: string = null;
                    data.forEach((value) => {
                        if(makhachhang == value.makhachhang){
                            luytien += value.tongtienban - value.tongtientra - value.tongtienthu + value.tongtienchi;
                        }
                        else{
                            makhachhang = value.makhachhang;
                            luytien = value.nodauky + value.tongtienban - value.tongtientra - value.tongtienthu + value.tongtienchi;
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

    customizeText(rowData) {
        return "-";
    }

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
    }
}
