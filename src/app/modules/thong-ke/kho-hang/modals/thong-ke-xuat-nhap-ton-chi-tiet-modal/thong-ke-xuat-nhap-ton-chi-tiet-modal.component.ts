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

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKeXuatNhapTonChiTiet'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeKhoHangService: ThongKeKhoHangService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon_ChiTiet(this.tungay, this.denngay, this.chinhanh_id, this.khohang_id, this.hanghoa_id).subscribe(
                (data) => {
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

    public onConfirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
