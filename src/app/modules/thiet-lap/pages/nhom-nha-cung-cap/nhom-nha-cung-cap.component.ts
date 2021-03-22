import { NhomNhaCungCapService } from './../../../../shared/services/thiet-lap/nhom-nha-cung-cap.service';
import { Subscription } from 'rxjs';
import { DxDataGridComponent } from 'devextreme-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppInfoService, CommonService, NhomKhachHangService } from '@app/shared/services';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-nhom-nha-cung-cap',
    templateUrl: './nhom-nha-cung-cap.component.html',
    styleUrls: ['./nhom-nha-cung-cap.component.css']
})
export class NhomNhaCungCapComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subcriptions */
    subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - NHÓM NHÀ CUNG CẤP - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_NhomNhaCungCap'
    };

    constructor(private titleService: Title, private appInfoService: AppInfoService, private router: Router, private commonService: CommonService, private nhomnhacungcapService: NhomNhaCungCapService) {
        this.titleService.setTitle("NHÓM NHÀ CUNG CẤP | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'nhomnhacungcap-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'nhomnhacungcap-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'nhomnhacungcap-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'nhomnhacungcap-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'nhomnhacungcap-xuatdulieu');
                },
                (error) => {
                    this.nhomnhacungcapService.handleError(error);
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
            this.nhomnhacungcapService.findNhomNhaCungCaps().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.nhomnhacungcapService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e): void {
        console.log(`nhomnhacungcap_id: ${e.key.id}`);
    }

    onRowDelete(id): void {
        let result = confirm('<i>bạn có muốn xóa nhóm nhà cung cấp này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                //gọi service xóa
                this.subscriptions.add(
                    this.nhomnhacungcapService.deleteNhomNhaCungCap(id).subscribe(
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
                            this.nhomnhacungcapService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
