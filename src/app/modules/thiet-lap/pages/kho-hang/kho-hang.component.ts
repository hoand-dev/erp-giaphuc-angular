import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChiNhanh, KhoHang } from '@app/shared/entities';
import { AppInfoService, CommonService, KhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-kho-hang',
    templateUrl: './kho-hang.component.html',
    styleUrls: ['./kho-hang.component.css']
})
export class KhoHangComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - KHO HÀNG - ' + moment().format('DD_MM_YYYY');

    private currChiNhanh: ChiNhanh;

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_KhoHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private khohangService: KhoHangService,
        private authenticationService: AuthenticationService
    ) {
        this.titleService.setTitle('KHO HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'khohang-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'khohang-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'khohang-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'khohang-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'khohang-xuatdulieu');
                },
                (error) => {
                    this.khohangService.handleError(error);
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
                    console.log('kho hàng page: ' + x.id);
                    this.currChiNhanh = x;
                    this.onLoadData(x.id);
                })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData(chinhanh_id: number = null) {
        chinhanh_id = chinhanh_id == null ? this.currChiNhanh.id : chinhanh_id;
        this.subscriptions.add(
            this.khohangService.findKhoHangs(chinhanh_id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.khohangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`khohang_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa kho hàng này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.khohangService.deleteKhoHang(id).subscribe(
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
                            this.onLoadData(this.currChiNhanh.id);
                        },
                        (error) => {
                            this.khohangService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData(this.currChiNhanh.id);
                        }
                    )
                );
            }
        });
    }
}
