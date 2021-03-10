import { environment } from './../../../../../environments/environment';
import { DxDataGridComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { AppInfoService, NhomKhachHangService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-nhom-khach-hang',
    templateUrl: './nhom-khach-hang.component.html',
    styleUrls: ['./nhom-khach-hang.component.css']
})
export class NhomKhachHangComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /*tối ưu subscriptions*/

    subscriptions: Subscription = new Subscription();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - NHÓM KHÁCH HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_NhomKhachHang'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private nhomkhachhangService: NhomKhachHangService) {
        this.titleService.setTitle('NHÓM KHÁCH HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData(): void {
        this.subscriptions.add(
            this.nhomkhachhangService.findNhomKhachHangs().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nhomkhachhangService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e): void {
        console.log(`nhomkhachhang_id: ${e.key.id}`);
    }

    onRowDelete(id): void {
        let result = confirm('<i>Bạn có muốn xóa nhóm khách hàng này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa

                this.subscriptions.add(
                    this.nhomkhachhangService.deleteNhomKhachHang(id).subscribe(
                        (data) => {
                            if (data) {
                                notify(
                                    {
                                        width: 320,
                                        message: 'Xóa thành công',
                                        position: { my: 'right top', at: 'right top' }
                                    },
                                    'success',
                                    475
                                );
                            }
                            this.onLoadData();
                        },
                        (error) => {
                            this.nhomkhachhangService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
