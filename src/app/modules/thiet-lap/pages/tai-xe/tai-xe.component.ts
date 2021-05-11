import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TaiXeService } from './../../../../shared/services/thiet-lap/tai-xe.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import moment from 'moment';
import { Title } from '@angular/platform-browser';
import { AppInfoService, CommonService } from '@app/shared/services';

@Component({
    selector: 'app-tai-xe',
    templateUrl: './tai-xe.component.html',
    styleUrls: ['./tai-xe.component.css']
})
export class TaiXeComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /*Tối ưu hóa subscriptions */
    subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - TÀI XẾ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        anable: true,
        type: 'localStorage',
        storageKey: 'dxGrid_Taixe'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private taixeService: TaiXeService) {
        this.titleService.setTitle("TÀI XẾ | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'taixe-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'taixe-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'taixe-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'taixe-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'taixe-xuatdulieu');
                },
                (error) => {
                    this.taixeService.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        //called once before the instance is destroyed
        // Add 'implements OnDestroy' to the class.

        //xử lý trước khi thoát khỏi trang
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.taixeService.findTaiXes(null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.taixeService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        //chuyển sang view xem chi tiết
        console.log(`taixe_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<id>Ban có muốn xóa số xe này?</id>', 'xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subscriptions.add(
                    this.taixeService.deleteTaiXe(id).subscribe(
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
                            //load lại dữ liệu
                            this.onLoadData();
                        },
                        (error) => {
                            this.taixeService.handleError(error);
                            //load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
