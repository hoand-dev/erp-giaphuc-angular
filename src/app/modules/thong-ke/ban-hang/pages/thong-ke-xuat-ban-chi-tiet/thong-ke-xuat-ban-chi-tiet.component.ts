import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeBanHangChiTiet } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeBanHangChiTietService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thong-ke-xuat-ban-chi-tiet',
  templateUrl: './thong-ke-xuat-ban-chi-tiet.component.html',
  styleUrls: ['./thong-ke-xuat-ban-chi-tiet.component.css']
})
export class ThongKeXuatBanChiTietComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    public dataSource_ThuChiTonQuy: ThongKeBanHangChiTiet[];
    public exportFileName: string = '[THỐNG KÊ] - XUẤT BÁN HÀNG CHI TIẾT - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeXuatBanHang_ChiTiet'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeBanhangService: ThongKeBanHangChiTietService
    ) {
        this.titleService.setTitle('THỐNG KÊ - XUẤT BÁN HÀNG CHI TIẾT | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkeban-xuatbanhangchitiet')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkeban-xuatbanhangchitiet-xuatdulieu');
                },
                (error) => {
                    this.objThongKeBanhangService.handleError(error);
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
            this.objThongKeBanhangService.findXuatBanChiTiets(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeBanhangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }
}
