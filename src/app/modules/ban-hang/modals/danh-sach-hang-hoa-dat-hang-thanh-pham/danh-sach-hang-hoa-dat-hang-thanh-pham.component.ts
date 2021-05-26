import { Component, OnInit, ViewChild } from '@angular/core';
import { ETrangThaiPhieu } from '@app/shared/enums';
import { KhachHangService, PhieuDatHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { HangHoaDatHang, HangHoaThanhPham, KhachHang } from '@app/shared/entities';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-danh-sach-hang-hoa-dat-hang-thanh-pham',
  templateUrl: './danh-sach-hang-hoa-dat-hang-thanh-pham.component.html',
  styleUrls: ['./danh-sach-hang-hoa-dat-hang-thanh-pham.component.css']
})
export class DanhSachHangHoaDatHangThanhPhamComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    isupdate: boolean = false;
    selectedItemKeys: any[] = [];
    public khachhangSelected: number = null;
    public lstKhachHang: KhachHang[] = [];
    public dataSource_KhachHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = false;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalHangHoaYeuCauGiaCong'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objPhieuDatHangService: PhieuDatHangService,  private modalService: BsModalService, private khachhangService: KhachHangService,) {}

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - XUẤT NHẬP TỒN CHI TIẾT - ' + moment().format('DD_MM_YYYY');
    
    ngOnInit(): void {
        this.onClose = new Subject();

        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );
        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhachHang = x;
                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
    }

    onKhachHangChanged(e){
        this.onLoadData();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    
    onLoadData() {
        this.subscriptions.add(
            this.objPhieuDatHangService.findHangHoaDatHangThanhPhams(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime, this.khachhangSelected).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data.filter(x => x.trangthaiban != ETrangThaiPhieu.daban); 
                   // 
                },
                (error) => {
                    this.objPhieuDatHangService.handleError(error);
                }
            )
        );
    }

    soluong_calculateCellValue(rowData){
        let x = <HangHoaThanhPham> rowData;
        return x.soluong - x.soluongtattoan - x.soluongdaban;
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    public selectionChanged(data: any) {
        this.selectedItemKeys = data.selectedRowKeys;
    }

    public onConfirm(action: string = null): void {
        this.bsModalRef.hide();
        this.onClose.next({ action: action, data: <HangHoaDatHang[]>this.selectedItemKeys });
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
