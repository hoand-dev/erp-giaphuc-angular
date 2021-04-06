import { Component, OnInit, ViewChild } from '@angular/core';
import { ThongKeCongNoDonViGiaCong, ThongKeCongNoNhaCungCap } from '@app/shared/entities';
import { ThongKeCongNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-nha-cung-cap-chi-tiet-cong-no-modal',
  templateUrl: './nha-cung-cap-chi-tiet-cong-no-modal.component.html',
  styleUrls: ['./nha-cung-cap-chi-tiet-cong-no-modal.component.css']
})
export class NhaCungCapChiTietCongNoModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;

    public title: string;
    public closeBtnName: string;

    public tungay: Date;
    public denngay: Date;
    public congnodonvigiacong: ThongKeCongNoNhaCungCap;
    
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* dataGrid */
    public exportFileName: string = '[THỐNG KÊ] - NHÀ CUNG CẤP CHI TIẾT CÔNG NỢ - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKe_ConNoNhaCungCap_ChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeCongNoService: ThongKeCongNoService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeCongNoService.findsCongNo_NhaCungCap_ChiTietPhieu(this.tungay, this.denngay, this.authenticationService.currentChiNhanhValue.id, this.congnodonvigiacong.nhacungcap_id).subscribe(
                (data) => {
                    let luytien = this.congnodonvigiacong.nodauky;
                    data.forEach((value) => {
                        luytien += value.tongtienmua - value.tongtientra - value.tongtienchi + value.tongtienthu;
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
