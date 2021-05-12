import { environment } from './../../../../../environments/environment';
import { DxDataGridComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { AppInfoService, CommonService, NhomKhachHangService } from '@app/shared/services';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-nhom-khach-hang',
    templateUrl: './nhom-khach-hang.component.html',
    styleUrls: ['./nhom-khach-hang.component.css']
})
export class NhomKhachHangComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /*tối ưu subscriptions*/
    subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - NHÓM KHÁCH HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_NhomKhachHang'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private nhomkhachhangService: NhomKhachHangService) {
        this.titleService.setTitle('NHÓM KHÁCH HÀNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'nhomkhachhang-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'nhomkhachhang-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'nhomkhachhang-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'nhomkhachhang-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'nhomkhachhang-xuatdulieu');
                },
                (error) => {
                    this.nhomkhachhangService.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData(): void {
        this.subscriptions.add(
            this.nhomkhachhangService.findNhomKhachHangs(null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nhomkhachhangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e): void {
        console.log(`nhomkhachhang_id: ${e.key.id}`);
    }

    onRowDelete(id): void {
        let result = confirm('<i>Bạn có muốn xóa nhóm khách hàng này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa

                this.subscriptions.add(
                    this.nhomkhachhangService.deleteNhomKhachHang(id).subscribe(
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
                            this.nhomkhachhangService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
