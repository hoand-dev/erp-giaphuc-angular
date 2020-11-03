import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SoMat } from '@app/shared/entities';
import { SoMatService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-so-mat',
    templateUrl: './so-mat.component.html',
    styleUrls: ['./so-mat.component.css']
})
export class SoMatComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    public stateStoringGrid = {
        enabled: true,
        type: "localStorage",
        storageKey: "dxGrid_SoMat"
    };

    constructor(
        private router: Router,
        private somatService: SoMatService
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
        this.subscriptions.add(this.somatService.findSoMats().subscribe(
            data => {
                this.dataGrid.dataSource = data;
            },
            error => {
                this.somatService.handleError(error);
            }
        ));
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`somat_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm("<i>Bạn có muốn xóa số mặt này?</i>", "Xác nhận xóa");
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(this.somatService.deleteSoMat(id).subscribe(
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
                        this.somatService.handleError(error);
                        // load lại dữ liệu
                        this.onLoadData();
                    }
                ));
            }
        });
    }
}