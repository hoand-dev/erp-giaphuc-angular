import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuNhapVatTu, PhieuNhapVatTu_ChiTiet, PhieuXuatVatTu_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, DonViTinhService, HangHoaService, KhoHangService, LenhSanXuatService, PhieuNhapVatTuService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import _  from 'lodash';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { custom } from 'devextreme/ui/dialog';
import { LoHangNhapXuatModalComponent } from '@app/shared/modals';

@Component({
  selector: 'app-phieu-nhap-vat-tu-modal',
  templateUrl: './phieu-nhap-vat-tu-modal.component.html',
  styleUrls: ['./phieu-nhap-vat-tu-modal.component.css']
})
export class PhieuNhapVatTuModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmphieunhapvattu: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    private bsModalRefChild: BsModalRef
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public phieunhapvattu_id: number;
    public lenhsanxuat_id: number; // khi thêm mới

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public phieunhapvattu: PhieuNhapVatTu;
    public phieunhapvattu_old: string;
    public saveProcessing = false;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_HangHoa: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_DonViTinh: DataSource;

    public hanghoas: PhieuNhapVatTu_ChiTiet[] = [];
    private hanghoalenght: number = 0;

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
        public hanghoaService: HangHoaService,
        public donvitinhService: DonViTinhService,
        public lenhsanxuatService: LenhSanXuatService,
        public modalService: BsModalService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();
        this.phieunhapvattu = new PhieuNhapVatTu();

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
                this.phieunhapvattuService.findPhieuNhapVatTu(this.phieunhapvattu_id).subscribe(
                    (data) => {
                        this.hanghoalenght = data.phieunhapvattu_chitiets.length;
                        this.phieunhapvattu = data;
                        this.hanghoas = data.phieunhapvattu_chitiets;
                    },
                    (error) => {
                        this.phieunhapvattuService.handleError(error);
                    }
                )
            );
        }


        if (this.isView == 'view_add' && this.lenhsanxuat_id) {
            this.hanghoas = [];
            this.lenhsanxuatService.findLenhSanXuatVatTu(this.lenhsanxuat_id, "nhapvattu").subscribe(
                (data) => {
                    // xử lý phần thông tin phiếu
                    this.phieunhapvattu.donvigiacong_id = data.donvigiacong_id;
                    this.phieunhapvattu.khogiacong_id = data.khogiacong_id;
                    this.phieunhapvattu.loaiphieu = data.loaiphieu;
                    this.phieunhapvattu.lenhsanxuat_id = data.id;

                    // xử lý phần thông tin chi tiết phiếu
                    data.phieunhapvattu_chitiets.forEach((value, index) => {
                            let item = new PhieuNhapVatTu_ChiTiet();
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
                    this.phieunhapvattuService.handleError(error);
                }
            );
        }
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            this.hanghoas[index].lohangs = JSON.parse(this.hanghoas[index].lohangstr);
        } else {
            this.hanghoas[index].khonhap_id = this.phieunhapvattu.khonhap_id;
        }
    }

    onClickLo(index) {
        if (!this.hanghoas[index].hanghoa_id) {
            custom({ messageHtml: 'Vui lòng chọn hàng hoá.', showTitle: false }).show();
            return;
        }

        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CHI TIẾT LÔ', // và nhiều hơn thế nữa
            khohang_id: this.phieunhapvattu.khonhap_id,
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

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khogiacong_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khogiacong_id = this.phieunhapvattu.khogiacong_id;
            });
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapvattu.khonhap_id;
            });
        }
    }
    
    onSubmitForm(e) {
        if (!this.frmphieunhapvattu.instance.validate().isValid) return;
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);

        let phieunhapvattu_req = this.phieunhapvattu;
        phieunhapvattu_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapvattu_req.phieunhapvattu_chitiets = hanghoas;

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
