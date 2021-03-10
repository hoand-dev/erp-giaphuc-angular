import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh } from '@app/shared/entities';
import { AppInfoService, KhachHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-khach-hang',
    templateUrl: './khach-hang.component.html',
    styleUrls: ['./khach-hang.component.css']
})
export class KhachHangComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /*tối ưu subscriptions */

    subscriptions: Subscription = new Subscription();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - KHÁCH HÀNG - ' + moment().format('DD_MM_YYYY');

    private currentChiNhanh = ChiNhanh;

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_KhachHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private khachhangService: KhachHangService,
        private authenticationService: AuthenticationService
    ) {
        this.titleService.setTitle("KHÁCH HÀNG | " + this.appInfoService.appName);
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.khachhangService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        console.log(`khachhang_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i> Bạn có muốn xóa khách hàng này</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                this.subscriptions.add(
                    this.khachhangService.deleteKhachHang(id).subscribe(
                        (data) => {
                            if (data) {
                                notify(
                                    {
                                        width: 320,
                                        message: 'Xóa thành công',
                                        position: { my: 'right top', at: 'right top' }
                                    },
                                    'sucess',
                                    475
                                );
                            }
                            this.onLoadData();
                        },
                        (error) => {
                            this.khachhangService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
