import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuNhapVatTu, PhieuXuatVatTu_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, HangHoaService, KhoHangService, PhieuNhapVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-phieu-nhap-vat-tu-modal',
  templateUrl: './phieu-nhap-vat-tu-modal.component.html',
  styleUrls: ['./phieu-nhap-vat-tu-modal.component.css']
})
export class PhieuNhapVatTuModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmphieunhapvattu: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public phieunhapvattu_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public phieunhapvattu: PhieuNhapVatTu;
    public phieunhapvattu_old: string;
    public saveProcessing = false;

        
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_HangHoa: DataSource;
    public dataSource_KhoHang: DataSource;

    public hanghoas: PhieuXuatVatTu_ChiTiet[] = [];


    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private phieunhapvattuService: PhieuNhapVatTuService,
        public sumTotal: SumTotalPipe,
        public khohangService: KhoHangService,
        public donvigiacongService: DonViGiaCongService,
        public hanghoaService: HangHoaService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhapvattu = new PhieuNhapVatTu();
        this.theCallbackValid = this.theCallbackValid.bind(this);

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


        if (this.isView == 'view_add') {
            this.subscriptions.add(
                this.phieunhapvattuService.findPhieuNhapVatTu(this.phieunhapvattu_id).subscribe(
                    (data) => {
                        this.phieunhapvattu = data;
                    },
                    (error) => {
                        this.phieunhapvattuService.handleError(error);
                    }
                )
            );
        }
        if (this.isView == 'view_edit') {
            this.subscriptions.add(
                this.phieunhapvattuService.findPhieuNhapVatTu(this.phieunhapvattu_id).subscribe(
                    (data) => {
                        this.phieunhapvattu = data;
                        this.phieunhapvattu_old = this.phieunhapvattu.maphieu;
                    },
                    (error) => {
                        this.phieunhapvattuService.handleError(error);
                    }
                )
            );
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
       
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        // let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        // if (rowsNull.length == 0) {
        //     this.onHangHoaAdd();
        // }
    }


    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        if (this.isView == 'view_add') {
            return this.phieunhapvattuService.checkExistPhieuNhapVatTu(params.value, null);
        }
        if (this.isView == 'view_edit') {
            return this.phieunhapvattuService.checkExistPhieuNhapVatTu(params.value, this.phieunhapvattu_old);
        }
    }

    onSubmitForm(e) {
        if (!this.frmphieunhapvattu.instance.validate().isValid) return;

        let phieunhapvattu_req = this.phieunhapvattu;
        phieunhapvattu_req.chinhanh_id = this.currentChiNhanh.id;

        if (this.isView == 'view_add') {
            this.onAddNew(phieunhapvattu_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(phieunhapvattu_req);
        }

        e.preventDefault();
    }

    onAddNew(phieunhapvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapvattuService.addPhieuNhapVatTu(phieunhapvattu_req).subscribe(
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
                    this.phieunhapvattuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(phieunhapvattu_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapvattuService.updatePhieuNhapVatTu(phieunhapvattu_req).subscribe(
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
                    this.phieunhapvattuService.handleError(error);
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
