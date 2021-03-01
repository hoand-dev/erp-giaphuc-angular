import { Component, OnInit, ViewChild } from '@angular/core';
import { LoiGiaCong } from '@app/shared/entities';
import { DanhMucLoiService } from '@app/shared/services';

import { AuthenticationService } from '@app/_services';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-sach-loi-modal',
    templateUrl: './danh-sach-loi-modal.component.html',
    styleUrls: ['./danh-sach-loi-modal.component.css']
})
export class DanhSachLoiModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();

    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public dataSource_Loi: DataSource;
    public chitietlois: LoiGiaCong[] = [];

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private danhMucLoiService: DanhMucLoiService) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.subscriptions.add(
            this.danhMucLoiService.findDanhMucLois().subscribe(
                (data) => {
                    this.dataSource_Loi = new DataSource({
                        store: data,
                        paginate: true,
                        pageSize: 50
                    });
                },
                (error) => {
                    this.danhMucLoiService.handleError(error);
                }
            )
        );

        this.onAdd_Row();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onAdd_Row() {
        if (this.chitietlois != null) {
            let rowsNull = this.chitietlois.filter((x) => x.danhmucloi_id == null);
            if (rowsNull.length == 0) {
                this.chitietlois.push(new LoiGiaCong());
            }
        } else {
            this.chitietlois = [];
            this.chitietlois.push(new LoiGiaCong());
        }
    }

    onChange_Row() {
        let rowsNull = this.chitietlois.filter((x) => x.danhmucloi_id == null);
        if (rowsNull.length == 0) {
            this.onAdd_Row();
        }
    }

    onDelete_Row(item) {
        this.chitietlois = this.chitietlois.filter((i) => {
            return i !== item;
        });
    }

    public onConfirm(): void {
        this.chitietlois = this.chitietlois.filter((i) => i.danhmucloi_id !== null);
        this.onClose.next(this.chitietlois);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
