import { Component, OnInit, ViewChild } from '@angular/core';
import { ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-thong-ke-xuat-nhap-ton-chi-tiet-modal',
  templateUrl: './thong-ke-xuat-nhap-ton-chi-tiet-modal.component.html',
  styleUrls: ['./thong-ke-xuat-nhap-ton-chi-tiet-modal.component.css']
})
export class ThongKeXuatNhapTonChiTietModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    
    public title: string;
    public closeBtnName: string;
    
    public tungay: Date;
    public denngay: Date;

    public chinhanh_id: number;
    public khohang_id: number;
    public hanghoa_id: number;

    public tondauky: number = 0;
    public toncuoiky: number = 0;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKeXuatNhapTonChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeKhoHangService: ThongKeKhoHangService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.calculateSummary = this.calculateSummary.bind(this);
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon_ChiTiet(this.tungay, this.denngay, this.chinhanh_id, this.khohang_id, this.hanghoa_id).subscribe(
                (data) => {
                    let luytien = this.tondauky;
                    data.forEach((value) => {
                        luytien += value.soluongnhap - value.soluongxuat;
                        value.luytien = luytien;
                    });
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objThongKeKhoHangService.handleError(error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    calculateSummary(options) {
        if (options.name === 'RowsSummaryTonDauKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.tondauky;
            }
        }
        if (options.name === 'RowsSummaryTonCuoiKy') {
            if (options.summaryProcess === 'start') {
                options.totalValue = 0;
            } else if (options.summaryProcess === 'calculate') {
                options.totalValue = this.toncuoiky;
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
