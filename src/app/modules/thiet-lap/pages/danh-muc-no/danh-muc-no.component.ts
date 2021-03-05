import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DanhMucNo } from '@app/shared/entities';
import { DanhMucNoService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-no',
    templateUrl: './danh-muc-no.component.html',
    styleUrls: ['./danh-muc-no.component.css']
})
export class DanhMucNoComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

     /* dataGrid */
     public exportFileName: string = '[DANH SÁCH] - DANH MỤC NỢ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_DanhMucNo'
    };

    constructor(private router: Router, private danhmucnoService: DanhMucNoService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.onLoadData();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.danhmucnoService.findDanhMucNos().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.danhmucnoService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`danhmucno_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa danh mục này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.danhmucnoService.deleteDanhMucNo(id).subscribe(
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
                            // load lại dữ liệu
                            this.onLoadData();
                        },
                        (error) => {
                            this.danhmucnoService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
