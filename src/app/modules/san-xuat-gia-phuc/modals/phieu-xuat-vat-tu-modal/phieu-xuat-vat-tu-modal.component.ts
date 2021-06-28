import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuXuatVatTu, PhieuXuatVatTu_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, DonViTinhService, HangHoaService, KhoHangService, LenhSanXuatService, PhieuXuatVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import _  from 'lodash';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { LoHangNhapXuatModalComponent } from '@app/shared/modals';
import { custom } from 'devextreme/ui/dialog';
import { ETrangThaiPhieu } from '@app/shared/enums';

@Component({
    selector: 'app-phieu-xuat-vat-tu-modal',
    templateUrl: './phieu-xuat-vat-tu-modal.component.html',
    styleUrls: ['./phieu-xuat-vat-tu-modal.component.css']
})
export class PhieuXuatVatTuModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatVatTu: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    private bsModalRefChild: BsModalRef
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
    protected dataSource_DonViTinh: DataSource;

    public saveProcessing = false;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private phieuxuatvattuService: PhieuXuatVatTuService,
        private lenhsanxuatService: LenhSanXuatService,
        public donvigiacongService: DonViGiaCongService,
        public khohangService: KhoHangService,
        public hanghoaService: HangHoaService,
        private donvitinhService: DonViTinhService,
        private modalService: BsModalService,
        protected sumTotal: SumTotalPipe
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
        
        this.subscriptions.add(
            this.donvitinhService.findDonViTinhs().subscribe((x) => {
                this.dataSource_DonViTinh = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
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
            this.hanghoas = [];
            this.lenhsanxuatService.findLenhSanXuatVatTu(this.lenhsanxuat_id, "xuatvattu").subscribe(
                (data) => {
                    // xử lý phần thông tin phiếu
                    this.phieuxuatvattu.donvigiacong_id = data.donvigiacong_id;
                    this.phieuxuatvattu.loaiphieu = data.loaiphieu;
                    this.phieuxuatvattu.lenhsanxuat_id = data.id;

                    // xử lý phần thông tin chi tiết phiếu
                    data.phieuxuatvattu_chitiets.forEach((value, index) => {
                            let item = new PhieuXuatVatTu_ChiTiet();
                            item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                            item.loaihanghoa = value.loaihanghoa;
                            item.hanghoa_id = value.hanghoa_id;
                            item.dvt_id = value.dvt_id;
                            item.tilequydoi = value.tilequydoi;
                            item.soluongdinhmuc = value.soluong;
                            item.soluong = value.soluong;
                            item.soluonglo = 0;
                            item.chuthich = value.chuthich;
                            item.calculate = value.calculate;

                            item.lenhsanxuat_chitiet_id = value.lenhsanxuat_chitiet_id;

                            this.hanghoas.push(item);
                    });
                },
                (error) => {
                    this.phieuxuatvattuService.handleError(error);
                }
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onClickLo(index) {
        if (!this.hanghoas[index].hanghoa_id) {
            custom({ messageHtml: 'Vui lòng chọn hàng hoá.', showTitle: false }).show();
            return;
        }

        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CHI TIẾT LÔ', // và nhiều hơn thế nữa
            khohang_id: this.phieuxuatvattu.khoxuat_id,
            hanghoa_id: this.hanghoas[index].hanghoa_id,
            lohangs: _.cloneDeep(this.hanghoas[index].lohangs)
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(LoHangNhapXuatModalComponent, { class: 'modal-md modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRefChild.content.onClose.subscribe((result) => {
            if (result !== false) {
                this.hanghoas[index].lohangs = result;
                let soluonglo: number = 0;
                result.forEach((e) => {
                    soluonglo += e.soluong;
                });
                this.hanghoas[index].soluonglo = soluonglo;
                this.hanghoas[index].soluong = this.hanghoas[index].soluongdinhmuc - soluonglo;
                this.hanghoas[index].soluong = this.hanghoas[index].soluong < 0 ? 0 : this.hanghoas[index].soluong;
            }
        });
    }

    onCollapseRow(index){
        this.hanghoas[index].hidden = _.cloneDeep(!this.hanghoas[index].hidden);
    }

    onHiddenOf(id){
        let row = this.hanghoas.find(x => x.lenhsanxuat_chitiet_id == id && x.calculate == false);
        return row.hidden;
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

    onConfirm(): void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    onCancel(): void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }
}
