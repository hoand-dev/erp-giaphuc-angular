import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuXuatVatTu, PhieuXuatVatTu_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, HangHoaService, KhoHangService, PhieuXuatVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-phieu-xuat-vat-tu-modal',
    templateUrl: './phieu-xuat-vat-tu-modal.component.html',
    styleUrls: ['./phieu-xuat-vat-tu-modal.component.css']
})
export class PhieuXuatVatTuModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatVatTu: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public phieuxuatvattu_id: number; // khi cập nhật, xem lại
    public lenhsanxuat_id: number; // khi thêm mới

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public phieuxuatvattu: PhieuXuatVatTu;
    public hanghoas: PhieuXuatVatTu_ChiTiet[] = [];
    
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_HangHoa: DataSource;
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private phieuxuatvattuService: PhieuXuatVatTuService,
        public sumTotal: SumTotalPipe,
        public khohangService: KhoHangService,
        public donvigiacongService: DonViGiaCongService,
        public hanghoaService: HangHoaService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.phieuxuatvattu = new PhieuXuatVatTu();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                        this.dataSource_DonViGiaCong = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        this.dataSource_HangHoa = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, null, 'thanhpham', loadOptions)
                        .toPromise()
                        .then((result) => {
                            return result;
                        });
                },
                byKey: (key) => {
                    return this.hanghoaService
                        .findHangHoa(key)
                        .toPromise()
                        .then((result) => {
                            return result;
                        });
                }
            })
        });

        if (this.isView == 'view_edit' || this.isView == 'view') {
            this.subscriptions.add(
                this.phieuxuatvattuService.findPhieuXuatVatTu(this.phieuxuatvattu_id).subscribe(
                    (data) => {
                        this.phieuxuatvattu = data;
                    },
                    (error) => {
                        this.phieuxuatvattuService.handleError(error);
                    }
                )
            );
        }

        if (this.isView == 'view_add' && this.lenhsanxuat_id) {
            
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onSubmitForm(e) {
        if (!this.frmPhieuXuatVatTu.instance.validate().isValid) return;

        let phieuxuatvattu_req = this.phieuxuatvattu;
        phieuxuatvattu_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(phieuxuatvattu_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(phieuxuatvattu_req);
        }

        e.preventDefault();
    }

    onAddNew(phieuxuatvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatvattuService.addPhieuXuatVatTu(phieuxuatvattu_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: 'Lưu thành công',
                            position: { my: 'right top', at: 'right top' }
                        },
                        'success',
                        475
                    );

                    this.saveProcessing = false;
                    this.onConfirm();
                },
                (error) => {
                    this.phieuxuatvattuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(phieuxuatvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatvattuService.updatePhieuXuatVatTu(phieuxuatvattu_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: 'Lưu thành công',
                            position: { my: 'right top', at: 'right top' }
                        },
                        'success',
                        475
                    );

                    this.saveProcessing = false;
                    this.onConfirm();
                },
                (error) => {
                    this.phieuxuatvattuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onConfirm():void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    onCancel(): void{
        this.onClose.next(true);
        this.bsModalRef.hide();
    }
}