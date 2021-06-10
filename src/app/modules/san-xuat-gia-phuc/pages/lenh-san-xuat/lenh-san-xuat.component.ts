import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, LenhSanXuatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { LenhSanXuatModalComponent } from '../../modals/lenh-san-xuat-modal/lenh-san-xuat-modal.component';

@Component({
    selector: 'app-lenh-san-xuat',
    templateUrl: './lenh-san-xuat.component.html',
    styleUrls: ['./lenh-san-xuat.component.css']
})
export class LenhSanXuatComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    public subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = true;
    public enableUpdate: boolean = true;
    public enableDelete: boolean = true;
    public enableExport: boolean = true;

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - LỆNH SẢN XUẤT - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_LenhSanXuat'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private lenhsanxuatService: LenhSanXuatService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('LỆNH SẢN XUẤT | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    // if (!this.commonService.getEnablePermission(this.permissions, 'lenhsanxuat-truycap')) {
                    //     this.router.navigate(['/khong-co-quyen']);
                    // }
                    // this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'lenhsanxuat-themmoi');
                    // this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'lenhsanxuat-capnhat');
                    // this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'lenhsanxuat-xoa');
                    // this.enableExport = this.commonService.getEnablePermission(this.permissions, 'lenhsanxuat-xuatdulieu');
                },
                (error) => {
                    this.lenhsanxuatService.handleError(error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.lenhsanxuatService.findLenhSanXuats(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.lenhsanxuatService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onAddNew() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM LỆNH SẢN XUẤT',
            isView: 'view_add'
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(LenhSanXuatModalComponent, {
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
            title: 'CẬP NHẬT LỆNH SẢN XUẤT',
            isView: 'view_edit',
            lenhsanxuat_id: id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(LenhSanXuatModalComponent, {
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

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa danh mục này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.lenhsanxuatService.deleteLenhSanXuat(id).subscribe(
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
                            this.lenhsanxuatService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
