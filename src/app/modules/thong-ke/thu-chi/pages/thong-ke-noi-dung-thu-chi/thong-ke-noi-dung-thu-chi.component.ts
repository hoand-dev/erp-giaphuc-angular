import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ThongKeNoiDungThuChi } from '@app/shared/entities';
import { AppInfoService, ThongKeThuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-noi-dung-thu-chi',
    templateUrl: './thong-ke-noi-dung-thu-chi.component.html',
    styleUrls: ['./thong-ke-noi-dung-thu-chi.component.css']
})
export class ThongKeNoiDungThuChiComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    public dataSource_NoiDungThuChi: ThongKeNoiDungThuChi[];
    public exportFileName: string = '[THỐNG KÊ] - NỘI DUNG THU CHI - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeThuChi_NoiDung'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private authenticationService: AuthenticationService, private objThongKeThuChiService: ThongKeThuChiService) {
        this.titleService.setTitle('THỐNG KÊ - NỘI DUNG THU CHI | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh /* .pipe(first()) */
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
            this.objThongKeThuChiService.findsThuChi_NoiDung(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeThuChiService.handleError(error);
                }
            )
        );
    }

    calculateSummary(options) {}
}
