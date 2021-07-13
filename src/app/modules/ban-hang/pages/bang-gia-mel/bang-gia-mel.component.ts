import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BangGiaMel } from '@app/shared/entities';
import { AppInfoService, CommonService, BangGiaMelService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { BangGiaMelModalComponent } from '../../modals/bang-gia-mel-modal/bang-gia-mel-modal.component';

@Component({
  selector: 'app-bang-gia-mel',
  templateUrl: './bang-gia-mel.component.html',
  styleUrls: ['./bang-gia-mel.component.css']
})
export class BangGiaMelComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    public subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - BẢNG GIÁ MEL - ' + moment().format('DD_MM_YYYY');
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_BangGiaMel'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private banggiamelService: BangGiaMelService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('BẢNG GIÁ MEL | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'banggiamel-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'banggiamel-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'banggiamel-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'banggiamel-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'banggiamel-xuatdulieu');
                },
                (error) => {
                    this.banggiamelService.handleError(error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.banggiamelService.findBangGiaMels(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.banggiamelService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    openViewModal(rowData: BangGiaMel) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÔNG TIN BẢNG GIÁ MEL',
            isView: 'view',
            banggiamel_id: rowData.id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(BangGiaMelModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    onRowDblClick(e) {
        let rowData: BangGiaMel = e.key;
        this.openViewModal(rowData);
    }

    onAddNew() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM MỚI BẢNG GIÁ MEL',
            isView: 'view_add'
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(BangGiaMelModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if (result) {
                this.onLoadData();
            }
        });
    }

    onRowEdit(id) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CẬP NHẬT BẢNG GIÁ MEL',
            isView: 'view_edit',
            banggiamel_id: id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(BangGiaMelModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if (result) {
                this.onLoadData();
            }
        });
    }

    onRowDelete(row) {
        let result = confirm(`<i>Bạn có muốn xóa "${ row.data.mabanggia }" này?</i>`, 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.banggiamelService.deleteBangGiaMel(row.data.id).subscribe(
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
                            this.banggiamelService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
