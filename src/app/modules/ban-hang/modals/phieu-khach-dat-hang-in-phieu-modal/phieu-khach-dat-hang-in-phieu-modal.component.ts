import { Component, OnInit, ViewChild } from '@angular/core';
import { PhieuDatHang } from '@app/shared/entities';
import { PhieuDatHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

declare var Stimulsoft: any;

@Component({
    selector: 'app-phieu-khach-dat-hang-in-phieu-modal',
    templateUrl: './phieu-khach-dat-hang-in-phieu-modal.component.html',
    styleUrls: ['./phieu-khach-dat-hang-in-phieu-modal.component.css']
})
export class PhieuKhachDatHangInPhieuModalComponent implements OnInit {
    options: any = new Stimulsoft.Viewer.StiViewerOptions();
    viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public phieuDatHang: PhieuDatHang;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalPhieuKhachDatHangInPhieu'
    };

    constructor(public bsModalRef: BsModalRef, private objPhieuKhachDatHangService: PhieuDatHangService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh /* .pipe(first()) */
                .subscribe((x) => {
                    this.onLoadData();
                })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuKhachDatHangService.findPhieuDatHang(this.phieuDatHang.id).subscribe(
                (data) => {},
                (error) => {
                    this.objPhieuKhachDatHangService.handleError(error);
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
