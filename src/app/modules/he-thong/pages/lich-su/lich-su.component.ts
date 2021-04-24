import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LichSu, PhieuDatHangNCC } from '@app/shared/entities';
import { AppInfoService, CommonService, LichSuService, PhieuDatHangNCCService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm, custom } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';

import { ELichSu } from '@app/shared/enums';
import { PhieuNhapKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuXuatKhoViewModalComponent } from '@app/modules/kho-hang/modals/phieu-xuat-kho-view-modal/phieu-xuat-kho-view-modal.component';

@Component({
  selector: 'app-lich-su',
  templateUrl: './lich-su.component.html',
  styleUrls: ['./lich-su.component.css']
})
export class LichSuComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;
    public enableReView: boolean = false;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - LỊCH SỬ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_LichSuHeThong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private lichsuService: LichSuService,
        private authenticationService: AuthenticationService,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle("LỊCH SỬ | " + this.appInfoService.appName);
    }

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = moment().toDate(); //new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();  //.add(1, 'days')

        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;

                    if (!this.commonService.getEnablePermission(this.permissions, 'lichsu-truycap')) {
                        this.router.navigate(['/khong-co-quyen']);
                    }
                    this.enableReView = this.commonService.getEnablePermission(this.permissions, 'lichsu-xemlaiphieu');
                    this.enableExport = this.commonService.getEnablePermission(this.permissions, 'lichsu-xuatdulieu');
                },
                (error) => {
                    this.lichsuService.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh /* .pipe(first()) */
                .subscribe((x) => {
                    this.onLoadData();
                })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.lichsuService.finds(this.firstDayTime, this.currDayTime, this.authenticationService.currentChiNhanhValue.id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.lichsuService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        // double click xem thông tin phiếu
        let row: LichSu = e.key;
        
        switch (row.log_chucnang) {
            
            case ELichSu.DATHANGNCC:
                break;
            case ELichSu.MUAHANGNCC:
                break;
            case ELichSu.TRAHANGNCC:
                break;

            case ELichSu.HOPDONG:
                break;
            case ELichSu.BANGGIA:
                break;
            case ELichSu.DATHANG:
                break;
            case ELichSu.BANHANG:
                break;
            case ELichSu.TRAHANG:
                break;

            case ELichSu.NHAPKHO:
                this.showModalNhapKho(row);
                break;
            case ELichSu.XUATKHO:
                this.showModalXuatKho(row);
                break;
            case ELichSu.DIEUCHINHKHO:
                break;
            case ELichSu.XUATCHUYENKHO:
                break;
            case ELichSu.NHAPCHUYENKHO:
                break;

            case ELichSu.NHAPMUONHANG:
                break;
            case ELichSu.XUATMUONHANG:
                break;
            case ELichSu.XUATTRAMUONHANG:
                break;
            case ELichSu.NHAPTRAMUONHANG:
                break;

            case ELichSu.LENHVAY:
                break;
            case ELichSu.PHIEUTHU:
                break;
            case ELichSu.PHIEUCHI:
                break;
            case ELichSu.PHIEUCANTRU:
                break;
            
            case ELichSu.BANGGIAGIACONG:
                break;
            case ELichSu.XUATKHOGIACONG:
                break;
            case ELichSu.YEUCAUGIACONG:
                break;
            case ELichSu.NHAPTHANHPHAM:
                break;
        
            default: break;
        }
    }

    showModalNhapKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU NHẬP KHO: ${ moment(x.log_thoigianthaotac).format("HH:mm DD/MM/YYYY") } - ${ x.nguoithaotac } - ${ x.log_noidung }`,
            isView: 'xemlichsu',
            phieunhapkho_id: x.id,
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuNhapKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }

    showModalXuatKho(x: LichSu) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: `THÔNG TIN PHIẾU XUẤT KHO: ${ moment(x.log_thoigianthaotac).format("HH:mm DD/MM/YYYY") } - ${ x.nguoithaotac } - ${ x.log_noidung }`,
            isView: 'xemlichsu',
            phieuxuatkho_id: x.id,
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(PhieuXuatKhoViewModalComponent, {
            class: 'modal-xxl modal-dialog-centered',
            ignoreBackdropClick: false,
            keyboard: false,
            initialState
        });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
}