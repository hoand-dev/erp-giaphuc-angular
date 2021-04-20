import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, LenhVay, QuyTaiKhoan } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, LichSuService, LenhVayService, QuyTaiKhoanService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-lenh-vay-view-modal',
  templateUrl: './lenh-vay-view-modal.component.html',
  styleUrls: ['./lenh-vay-view-modal.component.css']
})
export class LenhVayViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public lenhvay_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;
    public lenhvay: LenhVay;

    public lstQuyTaiKhoan: QuyTaiKhoan[] = [];
    public dataSource_QuyTaiKhoan: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private lenhvayService: LenhVayService,
        private quytaikhoanService: QuyTaiKhoanService,
        private lichsuService: LichSuService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.lenhvay = new LenhVay();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.subscriptions.add(
                    this.quytaikhoanService.findQuyTaiKhoans(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstQuyTaiKhoan = x;

                        this.dataSource_QuyTaiKhoan = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.lenhvayService.findLenhVay(this.lenhvay_id).subscribe(
                    (data) => {
                        this.lenhvay = data;
                    },
                    (error) => {
                        this.lenhvayService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findLenhVay(this.lenhvay_id).subscribe(
                    (data) => {
                        this.lenhvay = data;
                    },
                    (error) => {
                        this.lichsuService.handleError(error);
                    }
                )
            );
        }
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
