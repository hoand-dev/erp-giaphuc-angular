import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { KhuVucService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { data } from 'jquery';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';

@Component({
    selector: 'app-khu-vuc',
    templateUrl: './khu-vuc.component.html',
    styleUrls: ['./khu-vuc.component.css']
})
export class KhuVucComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */

    subscriptions: Subscription = new Subscription();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_KhuVuc'
    };

    constructor(private router: Router, private khuvucService: KhuVucService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.khuvucService.findKhuVucs().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.khuvucService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        console.log(`khuvuc_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa khu vực này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subscriptions.add(
                    this.khuvucService.deleteKhuVuc(id).subscribe(
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
                            this.khuvucService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
