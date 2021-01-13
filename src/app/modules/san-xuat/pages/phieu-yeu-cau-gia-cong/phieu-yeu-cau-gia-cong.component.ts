import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuYeuCauGiaCong } from '@app/shared/entities';
import { PhieuYeuCauGiaCongService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-phieu-yeu-cau-gia-cong',
    templateUrl: './phieu-yeu-cau-gia-cong.component.html',
    styleUrls: ['./phieu-yeu-cau-gia-cong.component.css']
})
export class PhieuYeuCauGiaCongComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuYeuCauGiaCong'
    };

    constructor(private router: Router, private objPhieuYeuCauGiaCongService: PhieuYeuCauGiaCongService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh /* .pipe(first()) */
                .subscribe((x) => {
                    this.onLoadData();
                })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuYeuCauGiaCongService.findPhieuYeuCauGiaCongs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuYeuCauGiaCongService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) { 
        if (e.row.rowType === "data") {
            // e.items can be undefined
            if (!e.items) e.items = [];
            
            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            // e.items.push(
            //     {
            //         text: "Cập nhật hoá đơn", icon: "edit", visible: true,
            //         onItemClick: () => {
            //             let rowData: PhieuYeuCauGiaCong = e.row.key as PhieuYeuCauGiaCong;
            //             this.onCapNhatHoaDon(rowData.id, rowData.maphieuxuatkho, rowData.chungtu);
            //         }
            //     }
            // );
        }
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuYeuCauGiaCong_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuYeuCauGiaCongService.deletePhieuYeuCauGiaCong(id).subscribe(
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
                            this.objPhieuYeuCauGiaCongService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}