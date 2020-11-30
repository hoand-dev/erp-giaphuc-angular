import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuKhachTraHangService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription, Subject } from 'rxjs';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { AuthenticationService } from '@app/_services';





@Component({
  selector: 'app-danh-sach-phieu-khach-tra-hang-modal',
  templateUrl: './danh-sach-phieu-khach-tra-hang-modal.component.html',
  styleUrls: ['./danh-sach-phieu-khach-tra-hang-modal.component.css']
})
export class DanhSachPhieuKhachTraHangModalComponent implements OnInit {

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();
    
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalPhieuKhachTraHang'
    };

    constructor(
        public bsModalRef: BsModalRef, 
        private objPhieuKhachTraHangService: PhieuKhachTraHangService,
        private authenticationService: AuthenticationService) 
        {}

    ngOnInit(): void {
        this.onClose = new Subject();

        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();

        this.subscriptions.add(this.authenticationService.currentChiNhanh/* .pipe(first()) */
            .subscribe(x => {
                this.onLoadData();
            }))
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuKhachTraHangService.findPhieuKhachTraHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data.filter(x => x.trangthainhap != ETrangThaiPhieu.danhap);
                },
                (error) => {
                    this.objPhieuKhachTraHangService.handleError(error);
                }
            )
        );
    }

    onRowDblClick(e) {
        this.onConfirm(e.key);
    }

    public onConfirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
