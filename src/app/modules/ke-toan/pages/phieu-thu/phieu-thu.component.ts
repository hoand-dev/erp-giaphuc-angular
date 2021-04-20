import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuThu } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuThuService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as $ from 'jquery';
import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuChiInPhieuModalComponent } from '../../modals/phieu-chi-in-phieu-modal/phieu-chi-in-phieu-modal.component';
import { PhieuThuInPhieuComponent } from '../../modals/phieu-thu-in-phieu/phieu-thu-in-phieu.component';
import { Title } from '@angular/platform-browser';
import { PhieuThuViewModalComponent } from '../../modals/phieu-thu-view-modal/phieu-thu-view-modal.component';

@Component({
    selector: 'app-phieu-thu',
    templateUrl: './phieu-thu.component.html',
    styleUrls: ['./phieu-thu.component.css']
})
export class PhieuThuComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    public bsModalRef: BsModalRef;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU THU - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuThu'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuThuService: PhieuThuService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('PHIẾU THU | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieuthu-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieuthu-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieuthu-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieuthu-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieuthu-xuatdulieu');
                },
                (error) => {
                    this.objPhieuThuService.handleError(error);
                }
            )
        );
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

        // setTimeout(() => {
        //     $(".dx-clear-button-area").trigger("click");
        // });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuThuService.findPhieuThus(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuThuService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];

            //add custom menu item
            e.items.push(
                {
                    text: 'Xem lại',
                    icon: 'rename',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuThu = e.row.key as PhieuThu;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: 'THÔNG TIN PHIẾU THU',
                            isView: 'xemphieu',
                            phieuthu_id: rowData.id
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuThuViewModalComponent, {
                            class: 'modal-xxl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                },
                {
                    text: 'PHIEU THU C31',
                    icon: 'print',
                    visible: 'true',
                    onItemClick: () => {
                        let rowData: PhieuThu = e.row.key as PhieuThu;
                        /* Khởi tạo giá trị trên modal */
                        const initialState = {
                            title: 'PHIEU THU C31',
                            phieuthu_id: rowData.id
                        };
                        /* Hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuThuInPhieuComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = ' Đóng';
                    }
                }
            );
        }
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuThu_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuThuService.deletePhieuThu(id).subscribe(
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
                            this.objPhieuThuService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
