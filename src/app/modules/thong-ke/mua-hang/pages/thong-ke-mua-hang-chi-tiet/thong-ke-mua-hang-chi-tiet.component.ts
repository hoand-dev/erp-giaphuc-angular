import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ThongKeMuaHangChiTiet } from '@app/shared/entities';
import { AppInfoService, ThongKeMuaHangChiTietService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-mua-hang-chi-tiet',
    templateUrl: './thong-ke-mua-hang-chi-tiet.component.html',
    styleUrls: ['./thong-ke-mua-hang-chi-tiet.component.css']
})
export class ThongKeMuaHangChiTietComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    public dataSource_ThuChiTonQuy: ThongKeMuaHangChiTiet[];
    public exportFileName: string = '[THỐNG KÊ] - MUA HÀNG CHI TIẾT - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeMuaHang_ChiTiet'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private authenticationService: AuthenticationService,
        private objThongKeMuahangService: ThongKeMuaHangChiTietService
    ) {
        this.titleService.setTitle("THỐNG KÊ - CHI TIẾT MUA HÀNG | " + this.appInfoService.appName);
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
            this.objThongKeMuahangService.findPhieuMuaHangs(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeMuahangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    customizeText(rowData) {
        return '-';
    }
}
