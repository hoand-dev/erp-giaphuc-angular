import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuyTaiKhoan } from '@app/shared/entities';
import { QuyTaiKhoanService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-quy-tai-khoan',
    templateUrl: './quy-tai-khoan.component.html',
    styleUrls: ['./quy-tai-khoan.component.css']
})
export class QuyTaiKhoanComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    public stateStoringGrid = {
        enabled: true,
        type: "localStorage",
        storageKey: "dxGrid_QuyTaiKhoan"
    };

    constructor(
        private router: Router,
        private quytaikhoanService: QuyTaiKhoanService
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
        this.subscriptions.add(this.quytaikhoanService.findQuyTaiKhoans().subscribe(
            data => {
                this.dataGrid.dataSource = data;
            },
            error => {
                this.quytaikhoanService.handleError(error);
            }
        ));
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`quytaikhoan_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm("<i>Bạn có muốn xóa quỹ này?</i>", "Xác nhận xóa");
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(this.quytaikhoanService.deleteQuyTaiKhoan(id).subscribe(
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
                        this.quytaikhoanService.handleError(error);
                        // load lại dữ liệu
                        this.onLoadData();
                    }
                ));
            }
        });
    }
}