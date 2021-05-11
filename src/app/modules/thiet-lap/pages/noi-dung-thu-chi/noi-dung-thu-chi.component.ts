import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NoiDungThuChi } from '@app/shared/entities';
import { AppInfoService, CommonService, NoiDungThuChiService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-noi-dung-thu-chi',
    templateUrl: './noi-dung-thu-chi.component.html',
    styleUrls: ['./noi-dung-thu-chi.component.css']
})
export class NoiDungThuChiComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public exportFileName: string = '[DANH SÁCH] - NỘI DUNG THU CHI - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_NoiDungThuChi'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private noidungthuchiService: NoiDungThuChiService) {
        this.titleService.setTitle("NỘI DUNG THU CHI | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'noidungthuchi-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'noidungthuchi-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'noidungthuchi-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'noidungthuchi-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'noidungthuchi-xuatdulieu');
                },
                (error) => {
                    this.noidungthuchiService.handleError(error);
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
            this.noidungthuchiService.findNoiDungThuChis(null, null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.noidungthuchiService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`noidungthuchi_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa nội dung thu chi này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.noidungthuchiService.deleteNoiDungThuChi(id).subscribe(
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
                            this.noidungthuchiService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
