import { Component, OnInit, ViewChild } from '@angular/core';
import { ETrangThaiPhieu } from '@app/shared/enums';
import { LenhSanXuatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxDataGridComponent } from 'devextreme-angular';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-danh-sach-lenh-san-xuat-modal',
  templateUrl: './danh-sach-lenh-san-xuat-modal.component.html',
  styleUrls: ['./danh-sach-lenh-san-xuat-modal.component.css']
})
export class DanhSachLenhSanXuatModalComponent  implements OnInit {
    public subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* Khai báo thời gian bắt đầu và kết thúc */

    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public trangthainhap: string[] = [ETrangThaiPhieu.danhap];

    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_ModalPhieuBanHang'
    };

    constructor(public bsModalRef: BsModalRef, private objlenhsanxuatService: LenhSanXuatService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        /*khởi tạo thời gian bắt đầu và kế htu1c */
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().toDate();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.onLoadData();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objlenhsanxuatService.findLenhSanXuats(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data.filter((x) => this.trangthainhap.includes(x.trangthainhap));
                },
                (error) => {
                    this.objlenhsanxuatService.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex){
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onRowDblClick(e) {
        this.onConFirm(e.key);
    }

    public onConFirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}