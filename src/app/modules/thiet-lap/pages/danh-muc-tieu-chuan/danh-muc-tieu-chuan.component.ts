import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DanhMucTieuChuan } from '@app/shared/entities';
import { DanhMucTieuChuanService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-tieu-chuan',
    templateUrl: './danh-muc-tieu-chuan.component.html',
    styleUrls: ['./danh-muc-tieu-chuan.component.css']
})
export class DanhMucTieuChuanComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    public stateStoringGrid = {
        enabled: true,
        type: "localStorage",
        storageKey: "dxGrid_DanhMucTieuChuan"
    };

    constructor(
        private router: Router,
        private danhmuctieuchuanService: DanhMucTieuChuanService
    ) { }

    ngOnInit(): void {

    }

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
        this.subscriptions.add(this.danhmuctieuchuanService.findDanhMucTieuChuans().subscribe(
            data => {
                this.dataGrid.dataSource = data;
            },
            error => {
                this.danhmuctieuchuanService.handleError(error);
            }
        ));
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`danhmuctieuchuan_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm("<i>Bạn có muốn xóa danh mục này?</i>", "Xác nhận xóa");
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(this.danhmuctieuchuanService.deleteDanhMucTieuChuan(id).subscribe(
                    data => {
                        if (data) {
                            notify({
                                width: 320,
                                message: "Xóa thành công",
                                position: { my: "right top", at: "right top" }
                            }, "success", 475);
                        }
                        // load lại dữ liệu
                        this.onLoadData();
                    },
                    error => {
                        this.danhmuctieuchuanService.handleError(error);
                        // load lại dữ liệu
                        this.onLoadData();
                    }
                ));
            }
        });
    }
}