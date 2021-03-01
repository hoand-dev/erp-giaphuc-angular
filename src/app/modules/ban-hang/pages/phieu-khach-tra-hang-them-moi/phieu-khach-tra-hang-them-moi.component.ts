import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhachHang, KhoHang, NguoiDung, PhieuBanHang_ChiTiet, PhieuKhachTraHang, PhieuKhachTraHang_ChiTiet } from '@app/shared/entities';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import {
    AppInfoService,
    CommonService,
    HangHoaService,
    KhachHangService,
    KhoHangService,
    NguoiDungService,
    PhieuBanHangService,
    PhieuKhachTraHangService,
    RouteInterceptorService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DanhSachPhieuBanHangModalComponent } from '../../modals/danh-sach-phieu-ban-hang-modal/danh-sach-phieu-ban-hang-modal.component';

@Component({
    selector: 'app-phieu-khach-tra-hang-them-moi',
    templateUrl: './phieu-khach-tra-hang-them-moi.component.html',
    styleUrls: ['./phieu-khach-tra-hang-them-moi.component.css']
})
export class PhieuKhachTraHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuKhachTraHang: DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */

    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieukhachtrahang: PhieuKhachTraHang;
    public lstKhachHang: KhachHang[] = [];
    public lstKhoHang: KhoHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_NguoiDung: DataSource;

    public firstLoad_KhachHang = false;

    public hanghoas: PhieuKhachTraHang_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    public saveProcessing = false;
    public loadingVisible = true;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu đặt hàng
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

        // private phieubanhangService: PhieuBanHangService,
        private objPhieuBanHangService: PhieuBanHangService,
        private phieukhachtrahangService: PhieuKhachTraHangService,
        private khachhangService: KhachHangService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        private nguoidungService: NguoiDungService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmphieubanhang.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieukhachtrahang = new PhieuKhachTraHang();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                // ? lấy danh sách kho hàng theo chi nhánh hiện tại
                this.loadingVisible = true;
                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoHang = x;
                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );
        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhachHang = x;
                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.nguoidungService.findNguoiDungs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNguoiDung = x;
                this.dataSource_NguoiDung = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
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

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tuphieu)) {
                    this.hanghoas = [];
                    this.firstLoad_KhachHang = true;
                    // lấy thông tin phiếu bán hàng
                    this.objPhieuBanHangService.findPhieuBanHang(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            /* phiếu đặt hàng -> phiếu bán hàng*/
                            // xử lý phần thông tin phiếu
                            this.phieukhachtrahang.khachhang_id = data.khachhang_id;
                            this.phieukhachtrahang.khachhang_hoten = data.khachhang_hoten;
                            this.phieukhachtrahang.khachhang_dienthoai = data.khachhang_dienthoai;
                            this.phieukhachtrahang.khachhang_diachi = data.khachhang_diachi;
                            this.phieukhachtrahang.tongtienhang = data.tongtienhang;
                            this.phieukhachtrahang.thuevat = data.thuevat;
                            this.phieukhachtrahang.chietkhau = data.chietkhau;
                            this.phieukhachtrahang.tongthanhtien = data.tongthanhtien;
                            this.phieukhachtrahang.phieubanhang_id = data.id;
                            this.phieukhachtrahang.maphieubanhang = data.maphieubanhang;
                            this.phieukhachtrahang.nhanviensale_id = data.nhanviensale_id;
                            this.phieukhachtrahang.khonhap_id = data.khoxuat_id;
                            this.phieukhachtrahang.maphieubanhang = data.maphieubanhang;

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieubanhang_chitiet.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieubanhang_chitiet.forEach((value, index) => {
                                if (value.trangthaitra != ETrangThaiPhieu.datra) {
                                    let item = new PhieuKhachTraHang_ChiTiet();

                                    item.loaihanghoa = value.loaihanghoa;
                                    item.hanghoa_id = value.hanghoa_id;
                                    item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    item.dvt_id = value.dvt_id;
                                    item.tilequydoi = value.tilequydoi;
                                    item.soluong = (value.soluongdaxuat - value.soluongdatra) / value.tilequydoi;
                                    item.dongia = value.dongia;
                                    item.thuevat = value.thuevat;
                                    item.chietkhau = value.chietkhau;
                                    item.thanhtien = value.thanhtien;
                                    item.chuthich = value.chuthich;
                                    item.tenhanghoabanhang_inphieu = value.tenhanghoa_inphieu;
                                    item.phieubanhang_chitiet_id = value.id;

                                    this.hanghoas.push(item);
                                }
                            });
                        },
                        (error) => {
                            this.phieukhachtrahangService.handleError(error);
                        }
                    );
                }
            })
        );

        // thêm sẵn 1 dòng cho user
        this.onHangHoaAdd();
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
            title: 'DANH SÁCH PHIẾU BÁN HÀNG', // và nhiều hơn thế nữa
            trangthaixuat: ETrangThaiPhieu.chuaxuat
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuBanHangModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-khach-tra-hang/them-moi`], { queryParams: { tuphieu: result.id } });
        });
    }
    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            if (!this.firstLoad_KhachHang) {
                let khachhang = this.lstKhachHang.find((x) => x.id == this.phieukhachtrahang.khachhang_id);

                this.phieukhachtrahang.khachhang_dienthoai = khachhang ? khachhang.sodienthoai : null;
                this.phieukhachtrahang.khachhang_diachi = khachhang ? khachhang.diachi : null;
                this.phieukhachtrahang.khachhang_hoten = khachhang ? khachhang.tenkhachhang : null;
            } else {
                this.firstLoad_KhachHang = false;
            }

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieukhachtrahang.khachhang_id, this.currentChiNhanh.id, this.phieukhachtrahang.sort).subscribe((data) => {
                    this.phieukhachtrahang.nocu = data;
                })
            );
        }

        // nếu thay đổi chiết khấu -> set chiết khấu hàng hoá = 0
        if (e.dataField == 'chietkhau' && e.value != 0) {
            this.hanghoas.forEach((v, i) => {
                v.chietkhau = 0;
            });
        }

        // nếu thay đổi thuế vat -> set thuế vat hàng hoá = 0
        if (e.dataField == 'thuevat' && e.value != 0) {
            this.hanghoas.forEach((v, i) => {
                v.thuevat = 0;
            });
        }
        // nếu thay đổi kho xuất -> set khoxuat_id cho hàng hoá
        if (e.dataField == 'khonhap_id') {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieukhachtrahang.khonhap_id;
            });
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuKhachTraHang_ChiTiet());
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
        } else {
            this.hanghoas[index].khonhap_id = this.phieukhachtrahang.khonhap_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tenhanghoabanhang_inphieu = selected.tenhanghoa;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
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
                    this.phieukhachtrahang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieukhachtrahang.thuevat = 0;
                }
                break;
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.thanhtien = v.soluong * v.dongia;
            v.thanhtien = v.thanhtien - v.thanhtien * v.chietkhau + (v.thanhtien - v.thanhtien * v.chietkhau) * v.thuevat;

            tongtienhang += v.thanhtien;
        });
        this.phieukhachtrahang.tongtienhang = tongtienhang;
        this.phieukhachtrahang.tongthanhtien =
            tongtienhang - tongtienhang * this.phieukhachtrahang.chietkhau + (tongtienhang - tongtienhang * this.phieukhachtrahang.chietkhau) * this.phieukhachtrahang.thuevat;
    }
    public onSubmitForm(e) {
        if (!this.frmPhieuKhachTraHang.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieukhachtrahang_req = this.phieukhachtrahang;

        // gán lại dữ liệu
        phieukhachtrahang_req.chinhanh_id = this.currentChiNhanh.id;
        phieukhachtrahang_req.phieukhachtrahang_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieukhachtrahangService.addPhieuKhachTraHang(phieukhachtrahang_req).subscribe(
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
                    this.router.navigate(['/phieu-khach-tra-hang']);
                    this.frmPhieuKhachTraHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieukhachtrahangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
