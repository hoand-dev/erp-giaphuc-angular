import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NhaCungCapService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nha-cung-cap',
    templateUrl: './nha-cung-cap.component.html',
    styleUrls: ['./nha-cung-cap.component.css']
})
export class NhaCungCapComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* */

    subscriptions: Subscription = new Subscription();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorege',
        storageKey: 'dxGrid_NhaCungCap'
    };

    constructor(private router: Router, private nhacungcapService: NhaCungCapService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nhacungcapService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        console.log(`nhacungcap_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa nhà cung cấp này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                this.subscriptions.add(
                    this.nhacungcapService.deleteNhaCungCap(id).subscribe(
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
                            this.nhacungcapService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
