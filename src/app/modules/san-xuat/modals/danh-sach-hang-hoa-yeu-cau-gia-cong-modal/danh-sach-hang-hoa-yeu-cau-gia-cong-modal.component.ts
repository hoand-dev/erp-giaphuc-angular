import { Component, OnInit, ViewChild } from '@angular/core';
import { HangHoaDatHang } from '@app/shared/entities';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { PhieuDatHangService } from '@app/shared/services';

import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-sach-hang-hoa-yeu-cau-gia-cong-modal',
    templateUrl: './danh-sach-hang-hoa-yeu-cau-gia-cong-modal.component.html',
    styleUrls: ['./danh-sach-hang-hoa-yeu-cau-gia-cong-modal.component.css']
})
export class DanhSachHangHoaYeuCauGiaCongModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    isupdate: boolean = false;
    selectedItemKeys: any[] = [];

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalHangHoaYeuCauGiaCong'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objPhieuDatHangService: PhieuDatHangService) {}

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
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuDatHangService.findHangHoaDatHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data.filter(x => x.trangthaiyeucau != ETrangThaiPhieu.dalenkehoach);
                },
                (error) => {
                    this.objPhieuDatHangService.handleError(error);
                }
            )
        );
    }

    soluong_calculateCellValue(rowData){
        let x = <HangHoaDatHang> rowData;
        return x.soluong - x.soluongtattoan - x.soluongdayeucau;
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
