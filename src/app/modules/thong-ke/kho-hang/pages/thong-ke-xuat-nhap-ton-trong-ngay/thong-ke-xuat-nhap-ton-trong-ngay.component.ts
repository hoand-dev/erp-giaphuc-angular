import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeXuatNhapTonTrongNgay } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-xuat-nhap-ton-trong-ngay',
    templateUrl: './thong-ke-xuat-nhap-ton-trong-ngay.component.html',
    styleUrls: ['./thong-ke-xuat-nhap-ton-trong-ngay.component.css']
})
export class ThongKeXuatNhapTonTrongNgayComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;
    public loadingVisible: boolean = false;

    private subscriptions: Subscription = new Subscription();

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
    public dataSource_XuatNhapTon: ThongKeXuatNhapTonTrongNgay[];
    public exportFileName: string = '[THỐNG KÊ] - XUẤT NHẬP TỒN TRONG NGÀY - ' + moment().format('DD-MM-YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKe_XuatNhapTon_TrongNgay'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeKhoHangService: ThongKeKhoHangService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle("THỐNG KÊ - XUẤT NHẬP TỒN TRONG NGÀY | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkekho-trongngay')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkekho-trongngay-xuatdulieu');
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                }
            )
        );

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
        this.loadingVisible = true;
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon_TrongNgay(this.currDayTime, this.authenticationService.currentChiNhanhValue.id, null).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                    this.loadingVisible = false;
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                    this.loadingVisible = false;
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }
}
