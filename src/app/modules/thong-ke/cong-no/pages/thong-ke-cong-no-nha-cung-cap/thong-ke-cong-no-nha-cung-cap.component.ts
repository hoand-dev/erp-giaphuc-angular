import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThongKeCongNoNhaCungCap } from '@app/shared/entities';
import { AppInfoService, CommonService, ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DoiChieuCongNoNhaCungCapModalComponent } from '../../modals/doi-chieu-cong-no-nha-cung-cap-modal/doi-chieu-cong-no-nha-cung-cap-modal.component';

@Component({
    selector: 'app-thong-ke-cong-no-nha-cung-cap',
    templateUrl: './thong-ke-cong-no-nha-cung-cap.component.html',
    styleUrls: ['./thong-ke-cong-no-nha-cung-cap.component.css']
})
export class ThongKeCongNoNhaCungCapComponent implements OnInit, OnDestroy {
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

    public dataSource_CongNoNhaCungCap: ThongKeCongNoNhaCungCap[];
    public exportFileName: string = '[THỐNG KÊ] - CÔNG NỢ NHÀ CUNG CẤP - ' + moment().format('DD_MM_YYYY');

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ThongKeCongNo_NhaCungCap'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private authenticationService: AuthenticationService,
        private objThongKeCongNoService: ThongKeCongNoService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('THỐNG KÊ - CÔNG NỢ NHÀ CUNG CẤP | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    if (!this.commonService.getEnablePermission(this.permissions, 'thongkecongno-nhacungcap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, '');
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
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
        // gọi service lấy dữ liệu báo cáo
        this.subscriptions.add(
            this.objThongKeCongNoService.findsCongNo_NhaCungCap(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    // tính luỹ tiến theo từng khách hàng
                    let luytien: number = 0;
                    let manhacungcap: string = null;
                    data.forEach((value) => {
                        if (manhacungcap == value.manhacungcap) {
                            luytien += value.tongtienmua - value.tongtientra - value.tongtienchi + value.tongtienthu;
                        } else {
                            manhacungcap = value.manhacungcap;
                            luytien = value.nodauky + value.tongtienmua - value.tongtientra - value.tongtienchi + value.tongtienthu;
                        }
                        value.luytien = luytien;
                    });
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeCongNoService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push({
                text: 'Đối chiếu công nợ',
                icon: 'print',
                visible: true,
                onItemClick: () => {
                    let rowData: ThongKeCongNoNhaCungCap = e.row.key as ThongKeCongNoNhaCungCap;
                    this.openModal(rowData, 1);
                }
            });
        }
    }

    openModal(congnonhacungcap: ThongKeCongNoNhaCungCap, mauin: number) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'XEM IN ĐỐI CHIẾU CÔNG NỢ - MẪU ' + mauin,
            tungay: this.firstDayTime,
            denngay: this.currDayTime,
            congnonhacungcap: congnonhacungcap,
            mauin: mauin
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DoiChieuCongNoNhaCungCapModalComponent, {
            class: 'modal-xl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    customizeText(rowData) {
        return '-';
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryNoDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.nodauky;
            }
        }
        if (options.name === 'RowsSummaryNoCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.nocuoiky;
            }
        }
        if (options.name === 'RowsSummaryCongNoHienTai') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = options.value.congnohientai;
            }
        }
    }
}
