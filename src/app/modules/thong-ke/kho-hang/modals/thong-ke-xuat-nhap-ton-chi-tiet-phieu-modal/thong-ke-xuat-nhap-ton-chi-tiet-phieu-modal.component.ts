import { Component, OnInit, ViewChild } from '@angular/core';
import { ThongKeKhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal',
    templateUrl: './thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal.component.html',
    styleUrls: ['./thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal.component.css']
})
export class ThongKeXuatNhapTonChiTietPhieuModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    
    public title: string;
    public closeBtnName: string;
    
    public chinhanh_id: number;
    public khohang_id: number;
    public hanghoa_id: number;

    public view: string;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalThongKeXuatNhapTonChiTietPhieu'
    };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private objThongKeKhoHangService: ThongKeKhoHangService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        switch (this.view) {
            case "giugiacong":
                this.title += " - GIỮ GIA CÔNG";
                break;
            case "giubanhang":
                this.title += " - GIỮ BÁN HÀNG";
                break;
            case "giuchuyenkho":
                this.title += " - GIỮ CHUYỂN KHO";
                break;
            case "datgiuhang":
                this.title += " - ĐẶT GIỮ HÀNG";
                break;
            case "muachuanhap":
                this.title += " - ĐANG VỀ";
                break;
            case "yeucauchuanhap":
                this.title += " - ĐANG GIA CÔNG";
                break;
        }
        this.onLoadData();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objThongKeKhoHangService.findsXuatNhapTon_ChiTietPhieu(this.chinhanh_id, this.khohang_id, this.hanghoa_id, this.view).subscribe(
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
