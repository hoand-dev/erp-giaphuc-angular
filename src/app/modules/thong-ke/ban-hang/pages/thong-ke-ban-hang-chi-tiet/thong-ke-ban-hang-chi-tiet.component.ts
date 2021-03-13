import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ThongKeBanHangChiTiet } from '@app/shared/entities';
import { AppInfoService, ThongKeBanHangChiTietService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-ban-hang-chi-tiet',
    templateUrl: './thong-ke-ban-hang-chi-tiet.component.html',
    styleUrls: ['./thong-ke-ban-hang-chi-tiet.component.css']
})
export class ThongKeBanHangChiTietComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    public dataSource_ThuChiTonQuy: ThongKeBanHangChiTiet[];
    public exportFileName: string = '[THỐNG KÊ] - BÁN HÀNG CHI TIẾT - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeBanHang_ChiTiet'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private authenticationService: AuthenticationService,
        private objThongKeBanhangService: ThongKeBanHangChiTietService
    ) {
        this.titleService.setTitle('THỐNG KÊ - CHI TIẾT BÁN HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
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

    onLoadData() {
        // gọi service lấy dữ liệu báo cáo
        this.subscriptions.add(
            this.objThongKeBanhangService.findPhieuBanHangs(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeBanhangService.handleError(error);
                }
            )
        );
    }

    customizeText(rowData) {
        return '-';
    }
}
