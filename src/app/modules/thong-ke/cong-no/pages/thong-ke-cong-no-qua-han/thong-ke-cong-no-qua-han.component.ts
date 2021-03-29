import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeCongNoQuaHan } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-cong-no-qua-han',
    templateUrl: './thong-ke-cong-no-qua-han.component.html',
    styleUrls: ['./thong-ke-cong-no-qua-han.component.css']
})
export class ThongKeCongNoQuaHanComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    
    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;
    
    public dataSource_CongNoQuaHan: ThongKeCongNoQuaHan[];
    public exportFileName: string = "[THỐNG KÊ] - CÔNG NỢ QUÁ HẠN - " + moment().format("DD_MM_YYYY");

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeCongNo_QuaHan'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeCongNoService: ThongKeCongNoService
    ) {
        this.titleService.setTitle("THỐNG KÊ - CÔNG NỢ QUÁ HẠN | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkecongno-quahan')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkecongno-quahan-xuatdulieu');
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
                }
            )
        );

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
            this.objThongKeCongNoService.findsCongNo_QuaHan(this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
                }
            )
        );
    }

    calculateTongTien(options) {
        if (options.name === 'RowsSummaryTongTien') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.totalValue + 
                options.value.quahan0115 + 
                options.value.quahan1630 + 
                options.value.quahan3145 + 
                options.value.quahan4660 + 
                options.value.quahan61
                ;
            }
        }
    }
}
