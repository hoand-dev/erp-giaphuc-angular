import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TaiXeService } from './../../../../shared/services/thiet-lap/tai-xe.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import moment from 'moment';
import { Title } from '@angular/platform-browser';
import { AppInfoService } from '@app/shared/services';

@Component({
    selector: 'app-tai-xe',
    templateUrl: './tai-xe.component.html',
    styleUrls: ['./tai-xe.component.css']
})
export class TaiXeComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /*Tối ưu hóa subcriptions */
    subcriptions: Subscription = new Subscription();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - TÀI XẾ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        anable: true,
        type: 'localStorage',
        storageKey: 'dxGrid_Taixe'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private taixeService: TaiXeService) {
        this.titleService.setTitle("TÀI XẾ | " + this.appInfoService.appName);
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        //called once before the instance is destroyed
        // Add 'implements OnDestroy' to the class.

        //xử lý trước khi thoát khỏi trang
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subcriptions.unsubscribe();
    }

    onLoadData() {
        this.subcriptions.add(
            this.taixeService.findTaiXes().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.taixeService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        //chuyển sang view xem chi tiết
        console.log(`taixe_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<id>Ban có muốn xóa số xe này?</id>', 'xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subcriptions.add(
                    this.taixeService.deleteTaiXe(id).subscribe(
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
                            //load lại dữ liệu
                            this.onLoadData();
                        },
                        (error) => {
                            this.taixeService.handleError(error);
                            //load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
