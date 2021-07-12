import { Component, OnInit } from '@angular/core';
import { HangHoaDonViTinh } from '@app/shared/entities';
import { DonViTinhService } from '@app/shared/services';

import DataSource from 'devextreme/data/data_source';
import { custom } from 'devextreme/ui/dialog';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-hang-hoa-don-vi-tinh-modal',
    templateUrl: './hang-hoa-don-vi-tinh-modal.component.html',
    styleUrls: ['./hang-hoa-don-vi-tinh-modal.component.css']
})
export class HangHoaDonViTinhModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    protected onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public isView: string = 'view_add';

    protected dataSource_DonViTinh: DataSource;
    public hanghoadvts: HangHoaDonViTinh[] = [];
    public dvt_id: number; // dvt chính của hàng hoá

    protected congthucs: any[] = [
        { key: '*', name: 'Phép nhân' },
        { key: '/', name: 'Phép chia' }
    ];

    constructor(
        public bsModalRef: BsModalRef,
        private donvitinhService: DonViTinhService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.subscriptions.add(
            this.donvitinhService.findDonViTinhs().subscribe((x) => {
                this.dataSource_DonViTinh = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.onAdd_Row();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onAdd_Row() {
        if (this.hanghoadvts != null) {
            let rowsNull = this.hanghoadvts.filter((x) => x.dvt_id == null);
            if (rowsNull.length == 0) {
                this.hanghoadvts.push(new HangHoaDonViTinh());
            }
        } else {
            this.hanghoadvts = [];
            this.hanghoadvts.push(new HangHoaDonViTinh());
        }
    }

    onChange_Row() {
        let rowsNull = this.hanghoadvts.filter((x) => x.dvt_id == null);
        if (rowsNull.length == 0) {
            this.onAdd_Row();
        }
    }

    onDelete_Row(item) {
        this.hanghoadvts = this.hanghoadvts.filter((i) => {
            return i !== item;
        });
    }

    public onConfirm(): void {
        this.hanghoadvts = this.hanghoadvts.filter((i) => i.dvt_id !== null);

        const root = this.hanghoadvts.filter((i) => i.dvt_id === this.dvt_id);
        if(root.length >= 1){
            custom({showTitle: false, messageHtml: "Không chọn lại đơn vị tính chính."}).show();
            return;
        }

        const uniqueValues = new Set(this.hanghoadvts.map(v => v.dvt_id));
        if(uniqueValues.size != this.hanghoadvts.length) {
            custom({showTitle: false, messageHtml: "Đơn vị tính bị trùng, vui lòng kiểm tra lại."}).show();
            return;
        }

        this.onClose.next(this.hanghoadvts);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
