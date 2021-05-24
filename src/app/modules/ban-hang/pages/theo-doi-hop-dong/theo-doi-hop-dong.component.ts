import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh } from '@app/shared/entities';
import { AppInfoService, CommonService, TheoDoiHopDongService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import { confirm } from 'devextreme/ui/dialog';
import moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-theo-doi-hop-dong',
    templateUrl: './theo-doi-hop-dong.component.html',
    styleUrls: ['./theo-doi-hop-dong.component.css']
})
export class TheoDoiHopDongComponent implements OnInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /*tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - THEO DÕI HỢP ĐỒNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_TheoDoiHopDong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private theodoihopdongService: TheoDoiHopDongService,
        private authenticationService: AuthenticationService
    ) {
        this.titleService.setTitle("THEO DÕI HỢP ĐỒNG | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'theodoihopdong-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'theodoihopdong-themmoi');
                    this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'theodoihopdong-capnhat');
                    this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'theodoihopdong-xoa');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'theodoihopdong-xuatdulieu');
                },
                (error) => {
                    this.theodoihopdongService.handleError(error);
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
            this.theodoihopdongService.findtheodoihopdongs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.theodoihopdongService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        console.log(`hopdong_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i> Bạn có muốn xóa "hợp đồng này" này</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                this.subscriptions.add(
                    this.theodoihopdongService.deleteHopDong(id).subscribe(
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
                            this.theodoihopdongService.handleError(error);
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
