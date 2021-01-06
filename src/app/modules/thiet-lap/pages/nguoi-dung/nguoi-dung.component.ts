import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NguoiDungService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import { NguoiDung } from '@app/shared/entities';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-nguoi-dung',
    templateUrl: './nguoi-dung.component.html',
    styleUrls: ['./nguoi-dung.component.css']
})
export class NguoiDungComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_NguoiDung'
    };

    constructor(private router: Router, private nguoidungService: NguoiDungService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.nguoidungService.findNguoiDungs().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nguoidungService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push({
                text: 'Đặt mật khẩu về mặt định',
                icon: 'revert',
                visible: true,
                onItemClick: () => {
                    let rowData: NguoiDung = e.row.key as NguoiDung;
                    this.onResetPassword(rowData.id);
                }
            });
        }
    }

    onRowDblClick(e) {
        console.log(`nguoidung_id: ${e.key.id}`);
    }

    onResetPassword(id: number) {
        Swal.fire({
            title: 'Đặt lại mật khẩu?',
            text: 'Bạn có chắc muốn đặt lại mật khẩu!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                this.subscriptions.add(
                    this.nguoidungService.resetPassword(id).subscribe(
                        (data) => {
                            if (data) {
                                Swal.fire('Hoàn tất!', 'Mật khẩu đã được đặt lại.', 'success');
                            }
                        },
                        (error) => {
                            this.nguoidungService.handleError(error);
                        }
                    )
                );
            }
        });
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa người này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subscriptions.add(
                    this.nguoidungService.deleteNguoiDung(id).subscribe(
                        (data) => {
                            if (data) {
                                notify(
                                    {
                                        width: 320,
                                        message: 'xóa thành công',
                                        position: { my: 'right top', at: 'right top' }
                                    },
                                    'success',
                                    475
                                );
                            }

                            this.onLoadData();
                        },
                        (error) => {
                            this.nguoidungService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
