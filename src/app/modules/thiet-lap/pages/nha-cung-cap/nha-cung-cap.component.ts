import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, NhaCungCapService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nha-cung-cap',
    templateUrl: './nha-cung-cap.component.html',
    styleUrls: ['./nha-cung-cap.component.css']
})
export class NhaCungCapComponent implements OnInit {
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
    public exportFileName: string = '[DANH SÁCH] - NHÀ CUNG CẤP - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorege',
        storageKey: 'dxGrid_NhaCungCap'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private nhacungcapService: NhaCungCapService) {
        this.titleService.setTitle("NHÀ CUNG CẤP | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'nhacungcap-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'nhacungcap-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'nhacungcap-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'nhacungcap-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'nhacungcap-xuatdulieu');
                },
                (error) => {
                    this.nhacungcapService.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nhacungcapService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        console.log(`nhacungcap_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa nhà cung cấp này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                this.subscriptions.add(
                    this.nhacungcapService.deleteNhaCungCap(id).subscribe(
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
                            this.nhacungcapService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
