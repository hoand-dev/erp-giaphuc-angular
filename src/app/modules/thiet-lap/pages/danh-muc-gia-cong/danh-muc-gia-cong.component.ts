import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DanhMucGiaCong } from '@app/shared/entities';
import { AppInfoService, CommonService, DanhMucGiaCongService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-gia-cong',
    templateUrl: './danh-muc-gia-cong.component.html',
    styleUrls: ['./danh-muc-gia-cong.component.css']
})
export class DanhMucGiaCongComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public exportFileName: string = '[DANH SÁCH] - DANH MỤC GIA CÔNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_DanhMucGiaCong'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private danhMucGiaCongService: DanhMucGiaCongService) {
        this.titleService.setTitle("DANH MỤC GIA CÔNG | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'danhmucgiacong-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'danhmucgiacong-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'danhmucgiacong-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'danhmucgiacong-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'danhmucgiacong-xuatdulieu');
                },
                (error) => {
                    this.danhMucGiaCongService.handleError(error);
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
            this.danhMucGiaCongService.findDanhMucGiaCongs(null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.danhMucGiaCongService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`danhMucGiaCong_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa danh mục gia công này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.danhMucGiaCongService.deleteDanhMucGiaCong(id).subscribe(
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
                            this.danhMucGiaCongService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
