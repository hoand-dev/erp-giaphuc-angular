import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ThongKeXuatNhapTon } from '@app/shared/entities';
import { ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-xuat-nhap-ton',
    templateUrl: './thong-ke-xuat-nhap-ton.component.html',
    styleUrls: ['./thong-ke-xuat-nhap-ton.component.css']
})
export class ThongKeXuatNhapTonComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscriptions: Subscription = new Subscription();

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public dataSource_XuatNhapTon: ThongKeXuatNhapTon[];
    public exportFileName: string = '[THỐNG KÊ] - XUẤT NHẬP TỒN - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKe_XuatNhapTon'
    };

    constructor(private authenticationService: AuthenticationService, private objThongKeKhoHangService: ThongKeKhoHangService) {}

    ngOnInit(): void {
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

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push({
                text: 'Xem chi tiết',
                icon: 'view',
                visible: true,
                onItemClick: () => {
                    let rowData: ThongKeXuatNhapTon = e.row.key as ThongKeXuatNhapTon;
                }
            });
        }
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id, null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                }
            )
        );
    }
}
