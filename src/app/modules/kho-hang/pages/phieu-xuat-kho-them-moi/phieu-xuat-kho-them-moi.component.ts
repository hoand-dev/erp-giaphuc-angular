import { ChiNhanh, KhachHang, PhieuXuatKho, PhieuXuatKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AppInfoService, CommonService, DanhSachXeService, KhachHangService, KhoHangService, PhieuBanHangService, PhieuTraHangNCCService, PhieuXuatKhoService, RouteInterceptorService, TaiXeService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';

import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { DanhSachPhieuTraHangNCCModalComponent } from '@app/modules/mua-hang/modals/danh-sach-phieu-tra-hang-ncc-modal/danh-sach-phieu-tra-hang-ncc-modal.component';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import moment from 'moment';
import { DanhSachPhieuBanHangModalComponent } from '@app/modules/ban-hang/modals/danh-sach-phieu-ban-hang-modal/danh-sach-phieu-ban-hang-modal.component';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-phieu-xuat-kho-them-moi',
    templateUrl: './phieu-xuat-kho-them-moi.component.html',
    styleUrls: ['./phieu-xuat-kho-them-moi.component.css']
})
export class PhieuXuatKhoThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatKho: DxFormComponent;

    public bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieuxuatkho: PhieuXuatKho;
    public lstKhachHang: KhachHang[] = [];
    public lstTaiXe: TaiXe[] = [];
    public lstXe: DanhSachXe[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public dataSource_TaiXe: DataSource;
    public dataSource_Xe: DataSource;
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatKho_ChiTiet[] = [];
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

        private objPhieuTraHangNCCService: PhieuTraHangNCCService,
        private objPhieuBanHangService: PhieuBanHangService,
        private phieuxuatkhoService: PhieuXuatKhoService,
        private khachhangService: KhachHangService,
        private taixeService: TaiXeService,
        private xeService: DanhSachXeService,
        private khoxuatService: KhoHangService,
        private hanghoaService: HangHoaService,

        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuXuatKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.phieuxuatkho = new PhieuXuatKho();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.subscriptions.add(
                    this.khoxuatService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoXuat = x;

                        this.dataSource_KhoXuat = new DataSource({
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
            this.taixeService.findTaiXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstTaiXe = x;

                this.dataSource_TaiXe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhachHang = x; // không có select box nên khỏi data source
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.xeService.findDanhSachXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstXe = x;

                this.dataSource_Xe = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, null, null, loadOptions)
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

        // console.log(this.routeInterceptorService.previousUrl);

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                this.phieuxuatkho = new PhieuXuatKho();
                this.hanghoas = [];

                // chọn từ phiếu mua hàng
                if (this.commonService.isNotEmpty(params.tuphieutrahangncc)) {
                    // cho hiển thị danh sách hàng hoá
                    this.isValidForm = true;
                    this.hanghoas = [];

                    /* chọn từ phiếu không cho thay đổi chi nhánh */
                    setTimeout(() => {
                        this.authenticationService.setDisableChiNhanh(true);
                    });

                    // lấy thông tin phiếu mua hàng từ api
                    this.objPhieuTraHangNCCService.findPhieuTraHangNCC(params.tuphieutrahangncc).subscribe(
                        (data) => {
                            /* phiếu mua hàng -> phiếu xuất kho */
                            // xử lý phần thông tin phiếu
                            this.phieuxuatkho.loaiphieuxuatkho = 'xuattrahangncc';
                            this.phieuxuatkho.nhacungcap_id = data.nhacungcap_id;
                            this.phieuxuatkho.khoxuat_id = data.khoxuat_id;

                            this.phieuxuatkho.nguoinhan_hoten = data.tennhacungcap;
                            this.phieuxuatkho.nguoinhan_diachi = data.diachinhacungcap;
                            this.phieuxuatkho.nguoinhan_dienthoai = data.dienthoainhacungcap;

                            this.phieuxuatkho.phieutrahangncc_id = data.id;
                            this.phieuxuatkho.tumaphieu = data.maphieutrahangncc;

                            this.phieuxuatkho.tongtienhang = data.tongtienhang;
                            this.phieuxuatkho.cuocvanchuyen = data.cuocvanchuyen;
                            this.phieuxuatkho.chietkhau = data.chietkhau;
                            this.phieuxuatkho.thuevat = data.thuevat;
                            this.phieuxuatkho.tongthanhtien = data.tongthanhtien;

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieutrahangncc_chitiet.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieutrahangncc_chitiet.forEach((value, index) => {
                                if (value.trangthaixuat != ETrangThaiPhieu.daxuat) {
                                    let chitiet = new PhieuXuatKho_ChiTiet();
                                    chitiet.khoxuat_id = this.phieuxuatkho.khoxuat_id;
                                    chitiet.loaihanghoa = value.loaihanghoa;
                                    chitiet.hanghoa_id = value.hanghoa_id;
                                    chitiet.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    chitiet.dvt_id = value.dvt_id;
                                    chitiet.tilequydoi = value.tilequydoi;

                                    chitiet.soluong = value.soluong - (value.soluongdaxuat / value.tilequydoi);

                                    chitiet.dongia = value.dongia;
                                    chitiet.cuocvanchuyen = value.cuocvanchuyen;
                                    chitiet.chietkhau = value.chietkhau;
                                    chitiet.thuevat = value.thuevat;
                                    chitiet.thanhtien = value.thanhtien;
                                    chitiet.chuthich = value.chuthich;

                                    // mua hàng không quản lý tên hàng hoá in phiếu
                                    // chitiet.tenhanghoa_inphieu = value.tenhanghoa_inphieu;

                                    chitiet.phieutrahangncc_chitiet_id = value.id;

                                    this.hanghoas.push(chitiet);
                                }
                            });
                        },
                        (error) => {
                            this.phieuxuatkhoService.handleError(error);
                        }
                    );
                }

                if (this.commonService.isNotEmpty(params.tuphieubanhang)) {
                    // cho hiển thị danh sách hàng hoá
                    this.isValidForm = true;
                    this.hanghoas = [];
                
                    /* chọn từ phiếu không cho thay đổi chi nhánh */
                    setTimeout(() => {
                        this.authenticationService.setDisableChiNhanh(true);
                    });
                
                    // lấy thông tin phiếu mua hàng từ api
                    this.objPhieuBanHangService.findPhieuBanHang(params.tuphieubanhang).subscribe(
                        (data) => {
                            /* phiếu mua hàng -> phiếu xuất kho */
                            // xử lý phần thông tin phiếu
                            this.phieuxuatkho.loaiphieuxuatkho = 'xuatbanhang';
                            this.phieuxuatkho.khachhang_id = data.khachhang_id;
                            this.phieuxuatkho.khoxuat_id = data.khoxuat_id;
                
                            this.phieuxuatkho.nguoinhan_hoten = data.khachhang_hoten;
                            this.phieuxuatkho.nguoinhan_diachi = data.khachhang_diachi;
                            this.phieuxuatkho.nguoinhan_dienthoai = data.khachhang_dienthoai;
                
                            this.phieuxuatkho.phieubanhang_id = data.id;
                            this.phieuxuatkho.tumaphieu = data.maphieubanhang;
                
                            this.phieuxuatkho.tongtienhang = data.tongtienhang;
                            this.phieuxuatkho.cuocvanchuyen = data.cuocvanchuyen;
                            this.phieuxuatkho.chietkhau = data.chietkhau;
                            this.phieuxuatkho.thuevat = data.thuevat;
                            this.phieuxuatkho.tongthanhtien = data.tongthanhtien;
                
                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieubanhang_chitiet.length;
                
                            // xử lý phần thông tin chi tiết phiếu
                            data.phieubanhang_chitiet.forEach((value, index) => {
                                if (value.trangthaixuat != ETrangThaiPhieu.daxuat) {
                                    let chitiet = new PhieuXuatKho_ChiTiet();
                                    chitiet.khoxuat_id = this.phieuxuatkho.khoxuat_id;
                                    chitiet.loaihanghoa = value.loaihanghoa;
                                    chitiet.hanghoa_id = value.hanghoa_id;
                                    chitiet.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    chitiet.dvt_id = value.dvt_id;
                                    chitiet.tilequydoi = value.tilequydoi;
                
                                    chitiet.soluong = value.soluong - value.soluongtattoan - (value.soluongdaxuat / value.tilequydoi);;
                
                                    chitiet.dongia = value.dongia;
                                    chitiet.cuocvanchuyen = value.cuocvanchuyen;
                                    chitiet.chietkhau = value.chietkhau;
                                    chitiet.thuevat = value.thuevat;
                                    chitiet.thanhtien = value.thanhtien;
                                    chitiet.chuthich = value.chuthich;
                
                                    chitiet.tenhanghoa_inphieu = value.tenhanghoa_inphieu;
                                    chitiet.phieubanhang_chitiet_id = value.id;
                
                                    this.hanghoas.push(chitiet);
                                }
                            });
                        },
                        (error) => {
                            this.phieuxuatkhoService.handleError(error);
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

    openModal(tuphieu: string) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: tuphieu == 'banhang' ? 'DANH SÁCH PHIẾU BÁN HÀNG' : 'DANH SÁCH PHIẾU TRẢ HÀNG NCC' // và nhiều hơn thế nữa
        };

        /* hiển thị modal */
        if(tuphieu == 'banhang'){
            this.bsModalRef = this.modalService.show(DanhSachPhieuBanHangModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        }
        else{
            this.bsModalRef = this.modalService.show(DanhSachPhieuTraHangNCCModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        }
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if(tuphieu == 'banhang')
                this.router.navigate([`/phieu-xuat-kho/them-moi`], { queryParams: { tuphieubanhang: result.id } });
            else this.router.navigate([`/phieu-xuat-kho/them-moi`], { queryParams: { tuphieutrahangncc: result.id } });
        });
    }

    onFormFieldChanged(e) {
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'khoxuat_id' && e.value !== undefined && e.value !== null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            // this.isValidForm = true;

            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieuxuatkho.khoxuat_id;
            });

            // sài nhờ trường này đi do không có element trên html
            let khachhang = this.lstKhachHang.find(x => x.id == this.phieuxuatkho.khachhang_id);
            if(khachhang){
                this.phieuxuatkho.songaytoihan = khachhang.songayno;
            }
        }

        if (e.dataField == 'taixe_id') {
            let taixe = this.lstTaiXe.find((x) => x.id == this.phieuxuatkho.taixe_id);
            this.phieuxuatkho.taixe_dienthoai = taixe ? taixe.dienthoai : null;
        }

        // thay đổi ngày tới hạn
        if (e.dataField == 'songaytoihan') {
            // trường hợp số ngày tới hạn bằng 0 và ngược lại
            if (e.value == 0 || e.value == null) {
                this.phieuxuatkho.ngaytoihan = null;
            } else {
                this.phieuxuatkho.ngaytoihan = moment(this.phieuxuatkho.ngayxuatkho).add(e.value, 'days').toDate();
            }
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

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        //this.hanghoas.push(new PhieuXuatKho_ChiTiet());
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
                if(this.phieuxuatkho.loaiphieuxuatkho = 'xuattrahangncc'){
                    this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;
                }
            });
        } else {
            this.hanghoas[index].khoxuat_id = this.phieuxuatkho.khoxuat_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;

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
                    this.phieuxuatkho.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieuxuatkho.thuevat = 0;
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
        this.phieuxuatkho.tongtienhang = tongtienhang;
        this.phieuxuatkho.tongthanhtien = tongtienhang - tongtienhang * this.phieuxuatkho.chietkhau + (tongtienhang - tongtienhang * this.phieuxuatkho.chietkhau) * this.phieuxuatkho.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null && x.soluong != 0);
        let phieuxuatkho_req = this.phieuxuatkho;

        // gán lại dữ liệu
        phieuxuatkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieuxuatkho_req.phieuxuatkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatkhoService.addPhieuXuatKho(phieuxuatkho_req).subscribe(
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
                    this.router.navigate(['/phieu-xuat-kho']);
                    this.frmPhieuXuatKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuxuatkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
