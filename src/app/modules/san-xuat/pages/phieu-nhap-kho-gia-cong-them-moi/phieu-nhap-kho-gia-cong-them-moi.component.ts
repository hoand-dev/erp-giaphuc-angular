import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DinhMuc, DonViGiaCong, HangHoa, KhachHang, KhoHang, PhieuNhapKhoGiaCong, PhieuNhapKhoGiaCongCT, PhieuYeuCauGiaCongCT, SoMat } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import {
    AppInfoService,
    CommonService,
    DinhMucService,
    DonViGiaCongService,
    HangHoaService,
    KhoHangService,
    PhieuNhapKhoGiaCongService,
    PhieuYeuCauGiaCongService,
    RouteInterceptorService,
    SoMatService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DanhSachLoiModalComponent } from '../../modals/danh-sach-loi-modal/danh-sach-loi-modal.component';
import { DanhSachPhieuYeuCauGiaCongModalComponent } from '../../modals/danh-sach-phieu-yeu-cau-gia-cong-modal/danh-sach-phieu-yeu-cau-gia-cong-modal.component';

@Component({
    selector: 'app-phieu-nhap-kho-gia-cong-them-moi',
    templateUrl: './phieu-nhap-kho-gia-cong-them-moi.component.html',
    styleUrls: ['./phieu-nhap-kho-gia-cong-them-moi.component.css']
})
export class PhieuNhapKhoGiaCongThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapKhoGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    bsModalRef: BsModalRef;

    public loaiphieu: string = 'taikho';
    public phieunhapkhogiacong: PhieuNhapKhoGiaCong;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapKhoGiaCongCT[] = [];

    public lstHangHoa: HangHoa[];
    public lstGiaCong: DinhMuc[];
    public lstSoMat: SoMat[];

    public dataSource_HangHoa: DataSource;
    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;
    private hanghoalenght_yeucau: number = 0;

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

        private phieunhapkhogiacongService: PhieuNhapKhoGiaCongService,
        private phieuyeucaugiacongService: PhieuYeuCauGiaCongService,
        private donvigiacongService: DonViGiaCongService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private giacongService: DinhMucService,
        private somatService: SoMatService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapKhoGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieunhapkhogiacong = new PhieuNhapKhoGiaCong();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                        this.loadingVisible = false;
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
            this.giacongService.findDinhMucs().subscribe((x) => {
                this.lstGiaCong = x;
                this.dataSource_GiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.somatService.findSoMats().subscribe((x) => {
                this.lstSoMat = x;
                this.dataSource_SoMat = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieunhapkhogiacong.khogiacong_id, 'hangtron,thanhpham', loadOptions)
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

        let arrLoaiPhieu: string[] = ['taikho', 'ngoai'];

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.loaiphieu) && arrLoaiPhieu.includes(params.loaiphieu)) {
                    this.loaiphieu = params.loaiphieu;

                    this.phieunhapkhogiacong.xuatnguyenlieu = this.loaiphieu == 'taikho' ? true : false;
                }

                if (this.commonService.isNotEmpty(params.tuphieu)) {
                    this.hanghoas = [];
                    setTimeout(() => {
                        this.authenticationService.setDisableChiNhanh(true);
                    });

                    this.phieuyeucaugiacongService.findPhieuYeuCauGiaCong(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            /* phiếu yêu cầu -> phiếu nhập kho */
                            // xử lý phần thông tin phiếu
                            this.phieunhapkhogiacong.donvigiacong_id = data.donvigiacong_id;
                            this.phieunhapkhogiacong.khogiacong_id = data.khogiacong_id;
                            this.phieunhapkhogiacong.tongthanhtien = data.tongthanhtien;
                            this.phieunhapkhogiacong.loaiphieu = data.loaiphieu;
                            this.phieunhapkhogiacong.xuatnguyenlieu = data.xuatnguyenlieu;
                            this.phieunhapkhogiacong.phieuyeucaugiacong_id = data.id;

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieuyeucaugiacong_chitiets.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieuyeucaugiacong_chitiets.forEach((value, index) => {
                                if (value.trangthainhap != ETrangThaiPhieu.danhap) {
                                    let item = new PhieuNhapKhoGiaCongCT();

                                    item.khogiacong_id = value.khogiacong_id;
                                    item.loaihanghoa = value.loaihanghoa;
                                    item.thanhpham_id = value.thanhpham_id;
                                    item.mathanhpham = value.mathanhpham;
                                    item.tenthanhpham = value.tenthanhpham;
                                    item.hanghoa_id = value.hanghoa_id;
                                    item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    item.dvt_id = value.dvt_id;
                                    item.tilequydoi = value.tilequydoi;
                                    item.somat_id = value.somat_id;
                                    item.heso = value.heso;
                                    item.soluong = (value.soluong - value.soluongtattoan - value.soluongdanhap) / value.tilequydoi;
                                    item.dongia = value.dongia;
                                    item.dongiavon = value.dongiavon;
                                    item.thanhtien = value.thanhtien;
                                    item.chuthich = value.chuthich;
                                    item.somat_thanhpham_id = value.somat_thanhpham_id;
                                    item.xuatnguyenlieu = value.xuatnguyenlieu;
                                    item.yeucaus = value.yeucaus;
                                    item.phieuyeucaugiacongct_id = value.id;

                                    this.hanghoas.push(item);
                                }
                            });
                        },
                        (error) => {
                            this.phieunhapkhogiacongService.handleError(error);
                        }
                    );
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    clickLayGia() {
        if (this.loaiphieu != 'taikho' && this.phieunhapkhogiacong.donvigiacong_id === null) {
            notify(
                {
                    width: 320,
                    message: 'Bạn chưa chọn đơn vị gia công.',
                    position: { my: 'right top', at: 'right top' }
                },
                'warning',
                475
            );
            return;
        }

        this.hanghoas.forEach((e) => {
            if (e.hanghoa_id != null)
                this.subscriptions.add(
                    this.phieunhapkhogiacongService.laygiaPhieuNhapKhoGiaCong(e.hanghoa_id, e.yeucaus, this.loaiphieu == 'taikho' ? null : this.phieunhapkhogiacong.donvigiacong_id).subscribe((x) => {
                        e.dongia = x;
                    })
                );
        });
    }

    openModal() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH PHIẾU YÊU CẦU GIA CÔNG' + (this.loaiphieu == 'taikho' ? ' TẠI KHO' : ' NGOÀI'), // và nhiều hơn thế nữa
            loaiphieu: this.loaiphieu
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuYeuCauGiaCongModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-nhap-kho-gia-cong/them-moi`], { queryParams: { loaiphieu: this.loaiphieu, tuphieu: result.id } });
        });
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khonhap_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapkhogiacong.khonhap_id;
            });
        }
    }

    displayExprHangHoa(item) {
        return item && item.tenhanghoa; //+ ' (' + item.soluong_tonhientai + ', ' + item.soluong_tonduocxuat + ')';
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            this.hanghoas[index].arr_yeucaus = JSON.parse(this.hanghoas[index].yeucaus);
            this.hanghoalenght_yeucau = this.hanghoas[index].arr_yeucaus.length;
            this.hanghoas[index].yeucaus = this.hanghoas[index].arr_yeucaus.toString();
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        this.onTinhTien();
    }

    private onTinhTien() {
        let tongtienhang: number = 0;
        this.hanghoas.forEach((v, i) => {
            v.thanhtien = v.soluong * v.dongia * v.heso;
            tongtienhang += v.thanhtien;
        });
        this.phieunhapkhogiacong.tongthanhtien = tongtienhang;
    }

    public onclickSoLuongLoi(index) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CHI TIẾT LỖI', // và nhiều hơn thế nữa
            chitietlois: this.hanghoas[index].chitietlois
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachLoiModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if (result !== false) {
                this.hanghoas[index].chitietlois = result;
                let soluongloi: number = 0;
                result.forEach((e) => {
                    soluongloi += e.soluong;
                });
                this.hanghoas[index].soluongloi = soluongloi;
            }
        });
    }

    public valid_khonhaphong(): boolean {
        if (this.hanghoas.filter((x) => x.soluongloi != 0 && x.khonhaploi_id == null).length > 0) {
            Swal.fire({
                title: 'Chọn kho nhập lỗi',
                html: 'Vui lòng chọn kho nhập cho số lượng lỗi đã nhập',
                icon: 'warning',
                timer: 3000,
                timerProgressBar: true
            });
            return false;
        }
        return true;
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuNhapKhoGiaCong.instance.validate().isValid) return;
        if (!this.valid_khonhaphong()) return;

        // bỏ qua các dòng dữ liệu số lượng = 0
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieunhapkhogiacong_req = this.phieunhapkhogiacong;

        // gán lại dữ liệu
        phieunhapkhogiacong_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapkhogiacong_req.loaiphieu = this.loaiphieu;
        phieunhapkhogiacong_req.phieunhapkhogiacong_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapkhogiacongService.addPhieuNhapKhoGiaCong(phieunhapkhogiacong_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-kho-gia-cong']);
                    this.frmPhieuNhapKhoGiaCong.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhapkhogiacongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
