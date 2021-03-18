import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppInfoService, BangGiaService, CommonService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-bang-gia',
    templateUrl: './bang-gia.component.html',
    styleUrls: ['./bang-gia.component.css']
})
export class BangGiaComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscription */
    private subscriptions: Subscription = new Subscription();

    /* Khai báo thời gian bắt đầu và kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - BẢNG GIÁ BÁN HÀNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: ' dxGrid_BangGia'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private objBangGiaService: BangGiaService,
        private authenticationService: AuthenticationService
    ) {
        this.titleService.setTitle("BẢNG GIÁ BÁN HÀNG | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'banggia-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'banggia-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'banggia-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'banggia-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'banggia-xuatdulieu');
                },
                (error) => {
                    this.objBangGiaService.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objBangGiaService.findBangGias(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objBangGiaService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        console.log(`objBangGia_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này ? </i>', 'xác nhận xóa');
        result.then((dialogResult) => {
            // gọi service xóa
            this.subscriptions.add(
                this.objBangGiaService.deleteBangGia(id).subscribe(
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
                        this.objBangGiaService.handleError(error);
                        // load lại dữ liệu
                        this.onLoadData();
                    }
                )
            );
        });
    }
}
