import { Component, OnInit, ViewChild } from '@angular/core';
import { ThongKeCongNoDonViGiaCong } from '@app/shared/entities';
import { ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-don-vi-gia-cong-chi-tiet-cong-no-modal',
    templateUrl: './don-vi-gia-cong-chi-tiet-cong-no-modal.component.html',
    styleUrls: ['./don-vi-gia-cong-chi-tiet-cong-no-modal.component.css']
})
export class DonViGiaCongChiTietCongNoModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;

    public title: string;
    public closeBtnName: string;

    public tungay: Date;
    public denngay: Date;
    public congnodonvigiacong: ThongKeCongNoDonViGiaCong;
    
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - GIA CÔNG CHI TIẾT CÔNG NỢ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKe_ConNoDonViGiaCong_ChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeCongNoService: ThongKeCongNoService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeCongNoService.findsCongNo_DonViGiaCong_ChiTietPhieu(this.tungay, this.denngay, this.authenticationService.currentChiNhanhValue.id, this.congnodonvigiacong.donvigiacong_id).subscribe(
                (data) => {
                    let luytien = this.congnodonvigiacong.nodauky;
                    data.forEach((value) => {
                        luytien += value.tiengiacong - value.tongtienchi + value.tongtienthu;
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

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryTonDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.congnodonvigiacong.nodauky;
            }
        }
        if (options.name === 'RowsSummaryTonCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.congnodonvigiacong.nocuoiky;
            }
        }
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
