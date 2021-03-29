import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeThuChiTonQuy } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeThuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-thu-chi-ton-quy',
    templateUrl: './thong-ke-thu-chi-ton-quy.component.html',
    styleUrls: ['./thong-ke-thu-chi-ton-quy.component.css']
})
export class ThongKeThuChiTonQuyComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    public dataSource_ThuChiTonQuy: ThongKeThuChiTonQuy[];
    public exportFileName: string = '[THỐNG KÊ] - THU CHI TỒN QUỸ - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeThuChi_TonQuy'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeThuChiService: ThongKeThuChiService
    ) {
        this.titleService.setTitle('THỐNG KÊ - THU CHI TỒN QUỸ | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkethuchi-tonquy')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkethuchi-tonquy-xuatdulieu');
                },
                (error) => {
                    this.objThongKeThuChiService.handleError(error);
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
            this.objThongKeThuChiService.findsThuChi_TonQuy(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeThuChiService.handleError(error);
                }
            )
        );
    }

    customizeText(rowData) {
        return '-';
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryTonDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.tondauky;
            }
        }
        if (options.name === 'RowsSummaryTonCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.toncuoiky;
            }
        }
        if (options.name === 'RowsSummaryTonHienTai') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.tonquyhientai;
            }
        }
    }
}
