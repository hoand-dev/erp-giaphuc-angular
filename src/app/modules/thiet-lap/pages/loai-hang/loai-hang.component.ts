import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, LoaiHangService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-loai-hang',
    templateUrl: './loai-hang.component.html',
    styleUrls: ['./loai-hang.component.css']
})
export class LoaiHangComponent implements OnInit {
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
    public exportFileName: string = '[DANH SÁCH] - LOẠI HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_LoaiHang'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private loaihangService: LoaiHangService) {
        this.titleService.setTitle("LOẠI HÀNG | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'loaihang-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'loaihang-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'loaihang-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'loaihang-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'loaihang-xuatdulieu');
                },
                (error) => {
                    this.loaihangService.handleError(error);
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

    onLoadData() {
        this.subscriptions.add(
            this.loaihangService.findLoaiHangs(null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.loaihangService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }
    
    onRowDblClick(e) {
        console.log(`loaihang_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa loại hàng này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subscriptions.add(
                    this.loaihangService.deleteLoaiHang(id).subscribe(
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
                            this.loaihangService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
