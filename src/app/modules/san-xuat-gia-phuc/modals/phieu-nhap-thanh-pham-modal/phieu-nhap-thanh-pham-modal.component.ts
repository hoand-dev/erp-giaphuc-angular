import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DanhSachLoiModalComponent } from '@app/modules/san-xuat/modals';
import { ChiNhanh, PhieuNhapThanhPham, PhieuNhapThanhPham_ChiTiet } from '@app/shared/entities';
import { ETrangThaiPhieu } from '@app/shared/enums';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, DonViTinhService, HangHoaService, KhoHangService, LenhSanXuatService, PhieuNhapThanhPhamService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { DanhSachLenhSanXuatModalComponent } from '../danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';

@Component({
    selector: 'app-phieu-nhap-thanh-pham-modal',
    templateUrl: './phieu-nhap-thanh-pham-modal.component.html',
    styleUrls: ['./phieu-nhap-thanh-pham-modal.component.css']
})
export class PhieuNhapThanhPhamModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapThanhPham: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'
    public bsModalRefChild: BsModalRef;

    /* thông tin cần để lấy dữ liệu */
    public phieunhapthanhpham_id: number;
    public lenhsanxuat_id: number; // khi thêm mới

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public phieunhapthanhpham: PhieuNhapThanhPham;
    public saveProcessing = false;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_HangHoa: DataSource;
    public dataSource_KhoHang: DataSource;
    protected dataSource_DonViTinh: DataSource;
    public dataSource_LoHang: DataSource[] = [];

    public hanghoas: PhieuNhapThanhPham_ChiTiet[] = [];

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private phieunhapthanhphamService: PhieuNhapThanhPhamService,
        private lenhsanxuatService: LenhSanXuatService,
        private donvigiacongService: DonViGiaCongService,
        private donvitinhService: DonViTinhService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        public sumTotal: SumTotalPipe,
        private modalService: BsModalService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhapthanhpham = new PhieuNhapThanhPham();
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

        if (this.isView == 'view_add') {
            this.onHangHoaAdd();
            this.copyLenhSanXuat(this.lenhsanxuat_id);
        }

        if (this.isView == 'view_edit' || this.isView == 'view') {
            this.subscriptions.add(
                this.phieunhapthanhphamService.findPhieuNhapThanhPham(this.phieunhapthanhpham_id).subscribe(
                    (data) => {
                        this.phieunhapthanhpham = data;
                        this.hanghoas = this.phieunhapthanhpham.phieunhapthanhpham_chitiets;
                    },
                    (error) => {
                        this.phieunhapthanhphamService.handleError(error);
                    }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    openModal() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH LỆNH SẢN XUẤT'
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(DanhSachLenhSanXuatModalComponent, { class: 'modal-xxl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRefChild.content.onClose.subscribe((result) => {
            if (result) {
                this.copyLenhSanXuat(result.id);
            }
        });
    }

    copyLenhSanXuat(lenhsanxuat_id: number) {
        this.hanghoas = [];
        this.lenhsanxuatService.findLenhSanXuat(lenhsanxuat_id).subscribe(
            (data) => {
                // xử lý phần thông tin phiếu
                this.phieunhapthanhpham.donvigiacong_id = data.donvigiacong_id;
                this.phieunhapthanhpham.khogiacong_id = data.khogiacong_id;
                this.phieunhapthanhpham.tongthanhtien = data.tongthanhtien;
                this.phieunhapthanhpham.loaiphieu = data.loaiphieu;
                this.phieunhapthanhpham.lenhsanxuat_id = data.id;

                // xử lý phần thông tin chi tiết phiếu
                data.lenhsanxuat_chitiets.forEach((value, index) => {
                    if (value.trangthainhap != ETrangThaiPhieu.danhap) {
                        let item = new PhieuNhapThanhPham_ChiTiet();

                        item.loaihanghoa = value.loaihanghoa;
                        item.hanghoa_id = value.hanghoa_id;
                        item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                        item.dvt_id = value.dvt_id;
                        item.tilequydoi = value.tilequydoi;
                        item.soluong = value.soluong - value.soluongtattoan - value.soluongdanhap;
                        item.dongia = value.dongia;
                        item.thanhtien = value.thanhtien;
                        item.chuthich = value.chuthich;
                        item.lenhsanxuat_chitiet_id = value.id;

                        this.onLoadDataSourceLo(index, value.hanghoa_id);
                        this.hanghoas.push(item);
                    }
                });
            },
            (error) => {
                this.phieunhapthanhphamService.handleError(error);
            }
        );
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.hanghoas, event.previousIndex, event.currentIndex);
    }

    
    onValueChangeLoHang(index, e) {
        e.value = e.selectedItem;
        if(e.value){
            this.hanghoaService.findLoHang(e.value.id).toPromise().then((result) => {
                this.hanghoas[index].malohang = result.malohang;
                this.hanghoas[index].hansudung = result.hansudung;
            });
        }
        else{
            this.hanghoas[index].malohang = null;
            this.hanghoas[index].hansudung = null;
        }
    }

    onLoadDataSourceLo(index, hanghoa_id) {
        this.dataSource_LoHang[index] = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoaLoHang_TonKhoHienTai(this.currentChiNhanh.id, null, hanghoa_id, loadOptions)
                        .toPromise()
                        .then((result) => {
                            return result;
                        });
                },
                byKey: (key) => {
                    return this.hanghoaService
                        .findLoHang(key)
                        .toPromise()
                        .then((result) => {
                            return result;
                        });
                }
            })
        });
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuNhapThanhPham_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        this.hanghoas[index].khogiacong_id = this.phieunhapthanhpham.khogiacong_id;
        this.hanghoas[index].khonhap_id = this.phieunhapthanhpham.khonhap_id;

        this.onLoadDataSourceLo(index, selected.id);

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        // let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        // if (rowsNull.length == 0) {
        //     this.onHangHoaAdd();
        // }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        this.onTinhTien();
    }

    private onTinhTien() {
        let tongtienhang: number = 0;
        this.hanghoas.forEach((v, i) => {
            v.thanhtien = v.soluong * v.dongia;
            tongtienhang += v.thanhtien;
        });
        this.phieunhapthanhpham.tongthanhtien = tongtienhang;
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khogiacong_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khogiacong_id = this.phieunhapthanhpham.khogiacong_id;
            });
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapthanhpham.khonhap_id;
            });
        }
    }

    onSubmitForm(e) {
        if (!this.frmPhieuNhapThanhPham.instance.validate().isValid) return;
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);

        let phieunhapthanhpham_req = this.phieunhapthanhpham;
        phieunhapthanhpham_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapthanhpham_req.phieunhapthanhpham_chitiets = hanghoas;

        if (this.isView == 'view_add') {
            this.onAddNew(phieunhapthanhpham_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(phieunhapthanhpham_req);
        }

        e.preventDefault();
    }

    onAddNew(phieunhapthanhpham_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapthanhphamService.addPhieuNhapThanhPham(phieunhapthanhpham_req).subscribe(
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
                    this.phieunhapthanhphamService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(phieunhapthanhpham_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapthanhphamService.updatePhieuNhapThanhPham(phieunhapthanhpham_req).subscribe(
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
                    this.phieunhapthanhphamService.handleError(error);
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
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
