import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuDieuChinhKho } from '@app/shared/entities';
import { AppInfoService, CommonService, PhieuDieuChinhKhoService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { PhieuDieuChinhKhoInPhieuModalComponent } from '../../modals';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-phieu-dieu-chinh-kho',
    templateUrl: './phieu-dieu-chinh-kho.component.html',
    styleUrls: ['./phieu-dieu-chinh-kho.component.css']
})
export class PhieuDieuChinhKhoComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - PHIẾU ĐIỀU CHỈNH KHO - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuDieuChinhKho'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objPhieuDieuChinhKhoService: PhieuDieuChinhKhoService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle("PHIẾU ĐIỀU CHỈNH KHO | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'phieudieuchinhkho-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'phieudieuchinhkho-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'phieudieuchinhkho-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'phieudieuchinhkho-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'phieudieuchinhkho-xuatdulieu');
                },
                (error) => {
                    this.objPhieuDieuChinhKhoService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            if (!e.items) e.items = [];

            e.items.push({
                text: 'In Phiếu',
                icon: 'print',
                visible: 'true',

                onItemClick: () => {
                    let rowData: PhieuDieuChinhKho = e.row.key as PhieuDieuChinhKho;

                    /* Khởi tạo gia trị modal */
                    const initialState = {
                        title: ' IN PHIẾU ĐIỀU CHỈNH KHO',
                        phieudieuchinhkho_id: rowData.id
                    };

                    /* Hiển thị modal */
                    this.bsModalRef = this.modalService.show(PhieuDieuChinhKhoInPhieuModalComponent, {
                        class: 'modal-xl modal-dialog-centered',
                        ignoreBackdropClick: false,
                        keyboard: false,
                        initialState
                    });
                    this.bsModalRef.content.closeBtnName = ' Đóng';
                }
            });
        }
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
            this.objPhieuDieuChinhKhoService.findPhieuDieuChinhKhos(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuDieuChinhKhoService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuDieuChinhKho_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuDieuChinhKhoService.deletePhieuDieuChinhKho(id).subscribe(
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
                            this.objPhieuDieuChinhKhoService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
