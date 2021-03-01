import { NhomNhaCungCapService } from './../../../../shared/services/thiet-lap/nhom-nha-cung-cap.service';
import { Subscription } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NhomKhachHangService } from '@app/shared/services';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';

@Component({
    selector: 'app-nhom-nha-cung-cap',
    templateUrl: './nhom-nha-cung-cap.component.html',
    styleUrls: ['./nhom-nha-cung-cap.component.css']
})
export class NhomNhaCungCapComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subcriptions */

    subscriptions: Subscription = new Subscription();
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_NhomNhaCungCap'
    };

    constructor(private router: Router, private nhomnhacungcapService: NhomNhaCungCapService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData(): void {
        this.subscriptions.add(
            this.nhomnhacungcapService.findNhomNhaCungCaps().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nhomnhacungcapService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e): void {
        console.log(`nhomnhacungcap_id: ${e.key.id}`);
    }

    onRowDelete(id): void {
        let result = confirm('<i>bạn có muốn xóa nhóm nhà cung cấp này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subscriptions.add(
                    this.nhomnhacungcapService.deleteNhomNhaCungCap(id).subscribe(
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
                            this.nhomnhacungcapService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
