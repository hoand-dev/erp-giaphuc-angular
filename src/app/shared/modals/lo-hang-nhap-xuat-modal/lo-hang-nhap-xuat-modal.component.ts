import { Component, OnInit, ViewChild } from '@angular/core';
import { LoHangNhapXuat } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, HangHoaService } from '@app/shared/services';

import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-lo-hang-nhap-xuat-modal',
    templateUrl: './lo-hang-nhap-xuat-modal.component.html',
    styleUrls: ['./lo-hang-nhap-xuat-modal.component.css']
})
export class LoHangNhapXuatModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();

    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public hanghoa_id: number;
    public khohang_id: number;
    public dataSource_LoHang: DataSource;
    public lohangs: LoHangNhapXuat[] = [];

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe,
        private hanghoaService: HangHoaService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.dataSource_LoHang = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoaLoHang_TonKhoHienTai(this.authenticationService.currentChiNhanhValue.id, this.khohang_id, this.hanghoa_id, loadOptions)
                        .toPromise().then((result) => { return result; });
                },
                byKey: (key) => {
                    return this.hanghoaService .findLoHang(key) .toPromise() .then((result) => { return result; });
                }
            })
        });

        this.onAdd_Row();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onAdd_Row() {
        if (this.lohangs != null) {
            let rowsNull = this.lohangs.filter((x) => x.hanghoa_lohang_id == null);
            if (rowsNull.length == 0) {
                this.lohangs.push(new LoHangNhapXuat());
            }
        } else {
            this.lohangs = [];
            this.lohangs.push(new LoHangNhapXuat());
        }
    }

    onChange_Row() {
        let rowsNull = this.lohangs.filter((x) => x.hanghoa_lohang_id == null);
        if (rowsNull.length == 0) {
            this.onAdd_Row();
        }
    }

    onDelete_Row(item) {
        this.lohangs = this.lohangs.filter((i) => {
            return i !== item;
        });
    }

    public onConfirm(): void {
        // return khi và chỉ khi có chọn lô hoặc nhập mã lô not null hoặc hạn sử dụng not null
        this.lohangs = this.lohangs.filter((i) => i.hanghoa_lohang_id !== null || i.malohang !== null || i.hansudung !== null);
        this.onClose.next(this.lohangs);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
