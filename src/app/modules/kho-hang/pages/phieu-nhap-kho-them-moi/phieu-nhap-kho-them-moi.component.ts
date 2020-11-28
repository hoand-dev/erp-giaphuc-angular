import { ChiNhanh, PhieuNhapKho, PhieuNhapKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AppInfoService, CommonService, KhoHangService, PhieuMuaHangNCCService, PhieuNhapKhoService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import { DanhSachPhieuMuaHangNCCModalComponent } from '@app/modules/mua-hang/modals/danh-sach-phieu-mua-hang-ncc-modal/danh-sach-phieu-mua-hang-ncc-modal.component';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';

@Component({
    selector: 'app-phieu-nhap-kho-them-moi',
    templateUrl: './phieu-nhap-kho-them-moi.component.html',
    styleUrls: ['./phieu-nhap-kho-them-moi.component.css']
})
export class PhieuNhapKhoThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapKho: DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieunhapkho: PhieuNhapKho;
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapKho_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private commonService: CommonService,
        private routeInterceptorService: RouteInterceptorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private objPhieuMuaHangNCCService: PhieuMuaHangNCCService,
        private phieunhapkhoService: PhieuNhapKhoService,
        private nhacungcapService: KhoHangService,
        private hanghoaService: HangHoaService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.phieunhapkho = new PhieuNhapKho();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.subscriptions.add(
                    this.nhacungcapService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoNhap = x;

                        this.dataSource_KhoNhap = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas().subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        // console.log(this.routeInterceptorService.previousUrl);

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                // chọn từ phiếu mua hàng
                if (this.commonService.isNotEmpty(params.tuphieumuahang)) {
                    // cho hiển thị danh sách hàng hoá
                    this.isValidForm = true;
                    this.hanghoas = [];

                    /* chọn từ phiếu không cho thay đổi chi nhánh */
                    setTimeout(() => {
                        this.authenticationService.setDisableChiNhanh(true);
                    });

                    // lấy thông tin phiếu mua hàng từ api
                    this.objPhieuMuaHangNCCService.findPhieuMuaHangNCC(params.tuphieumuahang).subscribe(
                        (data) => {
                            /* phiếu mua hàng -> phiếu nhập kho */
                            // xử lý phần thông tin phiếu
                            this.phieunhapkho.loaiphieunhapkho = 'nhapmuahang';
                            this.phieunhapkho.nhacungcap_id = data.nhacungcap_id;

                            this.phieunhapkho.nguoigiao_hoten = data.tennhacungcap;

                            this.phieunhapkho.phieumuahang_id = data.id;
                            this.phieunhapkho.tumaphieu = data.maphieumuahangncc;

                            this.phieunhapkho.tongtienhang = data.tongtienhang;
                            this.phieunhapkho.cuocvanchuyen = data.cuocvanchuyen;
                            this.phieunhapkho.chietkhau = data.chietkhau;
                            this.phieunhapkho.thuevat = data.thuevat;
                            this.phieunhapkho.tongthanhtien = data.tongthanhtien;

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieumuahangncc_chitiet.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieumuahangncc_chitiet.forEach((value, index) => {
                                if (value.trangthainhapkho != ETrangThaiPhieu.danhap) {
                                    let chitiet = new PhieuNhapKho_ChiTiet();
                                    chitiet.khonhap_id = this.phieunhapkho.khonhap_id;
                                    chitiet.loaihanghoa = value.loaihanghoa;
                                    chitiet.hanghoa_id = value.hanghoa_id;
                                    chitiet.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    chitiet.dvt_id = value.dvt_id;
                                    chitiet.tilequydoi = value.tilequydoi;

                                    chitiet.soluong = value.soluong - value.soluongdanhapkho;
                                    chitiet.soluonghong = 0;
                                    chitiet.khonhaphong_id = null;

                                    chitiet.dongia = value.dongia;
                                    chitiet.cuocvanchuyen = value.cuocvanchuyen;
                                    chitiet.chietkhau = value.chietkhau;
                                    chitiet.thuevat = value.thuevat;
                                    chitiet.thanhtien = value.thanhtien;
                                    chitiet.chuthich = value.chuthich;

                                    // mua hàng không quản lý tên hàng hoá in phiếu
                                    // chitiet.tenhanghoa_inphieu = value.tenhanghoa_inphieu;

                                    chitiet.phieumuahangncc_chitiet_id = value.id;

                                    this.hanghoas.push(chitiet);
                                }
                            });
                        },
                        (error) => {
                            this.phieunhapkhoService.handleError(error);
                        }
                    );
                }
            })
        );

        // thêm sẵn 1 dòng cho user
        // this.onHangHoaAdd();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    openModal() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH PHIẾU MUA HÀNG NCC' // và nhiều hơn thế nữa
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuMuaHangNCCModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-nhap-kho/them-moi`], { queryParams: { tuphieumuahang: result.id } });
        });
    }

    onFormFieldChanged(e) {
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            // this.isValidForm = true;
            
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapkho.khonhap_id;
            });
        }

        // // nếu thay đổi chiết khấu -> set chiết khấu hàng hoá = 0
        // if (e.dataField == 'chietkhau' && e.value != 0) {
        //     this.hanghoas.forEach((v, i) => {
        //         v.chietkhau = 0;
        //     });
        // }

        // // nếu thay đổi thuế vat -> set thuế vat hàng hoá = 0
        // if (e.dataField == 'thuevat' && e.value != 0) {
        //     this.hanghoas.forEach((v, i) => {
        //         v.thuevat = 0;
        //     });
        // }

        // // tính tổng tiền
        // this.onTinhTong();
    }

    public onHangHoaAdd() {
        //this.hanghoas.push(new PhieuNhapKho_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;

            setTimeout(() => {
                this.hanghoas[index].mahanghoa = selected.mahanghoa;
                this.hanghoas[index].tenhanghoa = selected.tenhanghoa;
            });
        } else {
            this.hanghoas[index].khonhap_id = this.phieunhapkho.khonhap_id;

            this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            //this.onHangHoaAdd(); // chức năng này tạm thời chưa nâng cấp
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        switch (col) {
            case 'soluong':
                this.hanghoas[index].soluong = e.value;
                break;
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieunhapkho.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieunhapkho.thuevat = 0;
                }
                break;
        }

        this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        this.hanghoas[index].thanhtien =
            this.hanghoas[index].thanhtien -
            this.hanghoas[index].thanhtien * this.hanghoas[index].chietkhau +
            (this.hanghoas[index].thanhtien - this.hanghoas[index].thanhtien * this.hanghoas[index].chietkhau) * this.hanghoas[index].thuevat;

        // tính tổng tiền sau chiết khấu
        this.onTinhTong();
    }

    // tính tổng tiền hàng và tổng thành tiền sau chiết khấu
    private onTinhTong() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            tongtienhang += v.thanhtien;
        });
        this.phieunhapkho.tongtienhang = tongtienhang;
        this.phieunhapkho.tongthanhtien = tongtienhang - tongtienhang * this.phieunhapkho.chietkhau + (tongtienhang - tongtienhang * this.phieunhapkho.chietkhau) * this.phieunhapkho.thuevat;
    }

    public valid_khonhaphong(): boolean {
        if (this.hanghoas.filter((x) => x.soluonghong != 0 && x.khonhaphong_id == null).length > 0) {
            Swal.fire({
                title: 'Chọn kho nhập hỏng',
                html: 'Vui lòng chọn kho nhập cho số lượng hỏng đã nhập',
                icon: 'warning',
                timer: 3000,
                timerProgressBar: true
            });
            return false;
        }
        return true;
    }

    public onSubmitForm(e) {
        if (!this.valid_khonhaphong()) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null && (x.soluong != 0 || x.soluonghong != 0));
        let phieunhapkho_req = this.phieunhapkho;

        // gán lại dữ liệu
        phieunhapkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapkho_req.phieunhapkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapkhoService.addPhieuNhapKho(phieunhapkho_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-kho']);
                    this.frmPhieuNhapKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhapkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}