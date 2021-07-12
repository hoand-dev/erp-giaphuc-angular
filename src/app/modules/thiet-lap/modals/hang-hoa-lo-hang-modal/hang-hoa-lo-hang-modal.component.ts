import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, HangHoa_LoHang } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, HangHoaService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-hang-hoa-lo-hang-modal',
  templateUrl: './hang-hoa-lo-hang-modal.component.html',
  styleUrls: ['./hang-hoa-lo-hang-modal.component.css']
})
export class HangHoaLoHangModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmLoHang: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* thông tin cần để lấy dữ liệu */
    public hanghoa_id: number;
    public lohangs: HangHoa_LoHang[] = [];

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public saveProcessing = false;

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_HangHoaLoHangDS'
    };

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private hanghoaService: HangHoaService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.subscriptions.add(
            this.hanghoaService.findLoHangs(this.hanghoa_id).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.hanghoaService.handleError(error);
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onConfirm(): void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
