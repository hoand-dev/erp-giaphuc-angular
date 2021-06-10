import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeCongNoKhachHang } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeSanXuatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thong-ke-tinh-hinh-san-xuat-don-hang',
  templateUrl: './thong-ke-tinh-hinh-san-xuat-don-hang.component.html',
  styleUrls: ['./thong-ke-tinh-hinh-san-xuat-don-hang.component.css']
})
export class ThongKeTinhHinhSanXuatDonHangComponent implements OnInit, OnDestroy {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;

    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    public dataSource_CongNoKhachHang: ThongKeCongNoKhachHang[];
    public exportFileName: string = '[THỐNG KÊ] - TÌNH HÌNH SẢN XUẤT - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKe_TinhHinhSanXuat_DonHang'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private thongKeSanXuatService: ThongKeSanXuatService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('THỐNG KÊ - TÌNH HÌNH SẢN XUẤT | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate(); //.add(1, 'days')
        
        // phân quyền
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkesanxuat-tinhhinhsanxuatdh')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'thongkesanxuat-tinhhinhsanxuatdh-xuatdulieu');
                },
                (error) => {
                    this.thongKeSanXuatService.handleError(error);
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

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onLoadData() {
        // gọi service lấy dữ liệu báo cáo
        this.subscriptions.add(
            this.thongKeSanXuatService.findsTinhHinhSanXuat_DonHang(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.thongKeSanXuatService.handleError(error);
                }
            )
        );
    }
}
