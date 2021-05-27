import { Component, OnInit, ViewChild } from '@angular/core';
import { PhiPhatSinh } from '@app/shared/entities';
import { NoiDungThuChiService } from '@app/shared/services';

import { AuthenticationService } from '@app/_services';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-sach-chi-phi-modal',
    templateUrl: './danh-sach-chi-phi-modal.component.html',
    styleUrls: ['./danh-sach-chi-phi-modal.component.css']
})
export class DanhSachChiPhiModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();

    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public dataSource_ChiPhi: DataSource;
    public chitietphiphatsinhs: PhiPhatSinh[] = [];

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private noidungthuchiService: NoiDungThuChiService) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.subscriptions.add(
            this.noidungthuchiService.findNoiDungThuChis(null, null).subscribe(
                (data) => {
                    this.dataSource_ChiPhi = new DataSource({
                        store: data,
                        paginate: true,
                        pageSize: 50
                    });
                },
                (error) => {
                    this.noidungthuchiService.handleError(error);
                }
            )
        );

        this.onAdd_Row();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onAdd_Row() {
        if (this.chitietphiphatsinhs != null) {
            let rowsNull = this.chitietphiphatsinhs.filter((x) => x.noidungthuchi_id == null);
            if (rowsNull.length == 0) {
                this.chitietphiphatsinhs.push(new PhiPhatSinh());
            }
        } else {
            this.chitietphiphatsinhs = [];
            this.chitietphiphatsinhs.push(new PhiPhatSinh());
        }
    }

    onChangeNoiDung() {
        let rowsNull = this.chitietphiphatsinhs.filter((x) => x.noidungthuchi_id == null);
        if (rowsNull.length == 0) {
            this.onAdd_Row();
        }
    }

    onChangeRow(index:number, e: any){
        this.chitietphiphatsinhs[index].thanhtien = this.chitietphiphatsinhs[index].soluong * this.chitietphiphatsinhs[index].dongia;
    }

    onDeleteRow(item) {
        this.chitietphiphatsinhs = this.chitietphiphatsinhs.filter((i) => {
            return i !== item;
        });
    }

    public onConfirm(): void {
        this.chitietphiphatsinhs = this.chitietphiphatsinhs.filter((i) => i.noidungthuchi_id !== null);
        this.onClose.next(this.chitietphiphatsinhs);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
