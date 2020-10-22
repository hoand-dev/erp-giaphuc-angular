import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh } from '@app/shared/entities';
import { ChiNhanhService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chi-nhanh',
    templateUrl: './chi-nhanh.component.html',
    styleUrls: ['./chi-nhanh.component.css']
})
export class ChiNhanhComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    private subscription: Subscription;

    public stateStoringGrid = {
        enabled: true,
        type: "localStorage",
        storageKey: "dxGrid_ChiNhanh"
    };

    constructor(
        private router: Router,
        private chinhanhService: ChiNhanhService
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
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    onLoadData() {
        this.subscription = this.chinhanhService.findChiNhanhs().subscribe(
            data => {
                this.dataGrid.dataSource = data;
            },
            error => {
                this.chinhanhService.handleError(error);
            }
        );
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`chinhanh_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm("<i>Bạn có muốn xóa chi nhánh này?</i>", "Xác nhận xóa");
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscription = this.chinhanhService.deleteChiNhanh(id).subscribe(
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
                        this.chinhanhService.handleError(error);
                        // load lại dữ liệu
                        this.onLoadData();
                    }
                );
            }
        });
    }

}
