import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, Ipv4Service } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Ipv4ModalComponent } from '../../modals/ipv4-modal/ipv4-modal.component';

@Component({
    selector: 'app-ipv4',
    templateUrl: './ipv4.component.html',
    styleUrls: ['./ipv4.component.css']
})
export class Ipv4Component implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = true;
    public enableUpdate: boolean = true;
    public enableDelete: boolean = true;
    public enableExport: boolean = true;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - IP - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_Ipv4'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private ipv4Service: Ipv4Service,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('IP | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    // if (!this.commonService.getEnablePermission(this.permissions, 'ipv4-truycap')) {
                    //     this.router.navigate(['/khong-co-quyen']);
                    // }
                    // this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'ipv4-themmoi');
                    // this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'ipv4-capnhat');
                    // this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'ipv4-xoa');
                    // this.enableExport = this.commonService.getEnablePermission(this.permissions, 'ipv4-xuatdulieu');
                },
                (error) => {
                    this.ipv4Service.handleError(error);
                }
            )
        );
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
        this.subscriptions.add(
            this.ipv4Service.findIpv4s().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.ipv4Service.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`ipv4_id: ${e.key.id}`);
    }

    onAddNew() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'THÊM IP',
            isView: 'view_add'
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(Ipv4ModalComponent, {
            class: 'modal-sm modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if(result){
                this.onLoadData();
            }
        });
    }

    onRowEdit(id) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CẬP NHẬT IP',
            isView: 'view_edit',
            ipv4_id: id,
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(Ipv4ModalComponent, {
            class: 'modal-sm modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if(result){
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
                    this.ipv4Service.deleteIpv4(id).subscribe(
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
                            this.ipv4Service.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
