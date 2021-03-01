import { Component, OnInit, ViewChild } from '@angular/core';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { PhieuYeuCauGiaCongService } from '@app/shared/services';

import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-sach-phieu-yeu-cau-gia-cong-modal',
    templateUrl: './danh-sach-phieu-yeu-cau-gia-cong-modal.component.html',
    styleUrls: ['./danh-sach-phieu-yeu-cau-gia-cong-modal.component.css']
})
export class DanhSachPhieuYeuCauGiaCongModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public trangthainhap: string = ETrangThaiPhieu.danhap;
    public loaiphieu: string = 'taikho';

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalPhieuYeuCauGiaCong'
    };

    constructor(public bsModalRef: BsModalRef, private phieuyeucaugiacongService: PhieuYeuCauGiaCongService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();

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

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.phieuyeucaugiacongService.findPhieuYeuCauGiaCongs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data.filter((x) => x.trangthainhap != this.trangthainhap && x.loaiphieu == this.loaiphieu);
                },
                (error) => {
                    this.phieuyeucaugiacongService.handleError(error);
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
