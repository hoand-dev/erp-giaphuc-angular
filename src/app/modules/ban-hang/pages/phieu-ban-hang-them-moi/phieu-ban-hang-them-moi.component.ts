import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, HangHoaDatHang, HangHoaThanhPham, KhachHang, KhoHang, NguoiDung, PhieuBanHang, PhieuBanHang_ChiTiet, PhieuDatHang, PhieuDatHang_ChiTiet } from '@app/shared/entities';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    CommonService,
    HangHoaService,
    KhachHangService,
    KhoHangService,
    NguoiDungService,
    PhieuBanHangService,
    PhieuDatHangService,
    RouteInterceptorService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DanhSachHangHoaDatHangThanhPhamComponent } from '../../modals/danh-sach-hang-hoa-dat-hang-thanh-pham/danh-sach-hang-hoa-dat-hang-thanh-pham.component';
import { DanhSachPhieuDatHangModalComponent } from '../../modals/danh-sach-phieu-dat-hang-modal/danh-sach-phieu-dat-hang-modal.component';

@Component({
    selector: 'app-phieu-ban-hang-them-moi',
    templateUrl: './phieu-ban-hang-them-moi.component.html',
    styleUrls: ['./phieu-ban-hang-them-moi.component.css']
})
export class PhieuBanHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuBanHang: DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieubanhang: PhieuBanHang;
    public lstKhachHang: KhachHang[] = [];
    public lstKhoHang: KhoHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_NguoiDung: DataSource;
    public dataSource_HangHoa: DataSource;

    public hanghoas: PhieuBanHang_ChiTiet[] = [];

    
    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu
    private hanghoalenght: number = 0;

    public firstLoad_KhachHang = false;

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    public isChonTuPhieu: boolean = false;

    public saveProcessing = false;
    public loadingVisible = false;


    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public sumTotal: SumTotalPipe,
        public appInfoService: AppInfoService,
        private commonService: CommonService,
        private routeInterceptorService: RouteInterceptorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private phieubanhangService: PhieuBanHangService,
        private objPhieuDatHangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        private nguoidungService: NguoiDungService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmphieubanhang.instance.validate(); // showValidationSummary sau khi focus out
    }
    asyncValidation: Function;

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieubanhang = new PhieuBanHang();
        this.asyncValidation = this.checkCoLayThue.bind(this);

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

                // gán nhân viên sale mặc định
                this.subscriptions.add(this.nguoidungService.getCurrentUser().subscribe((y) => (this.phieubanhang.nhanviensale_id = y.id)));

                this.dataSource_NguoiDung = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.dataSource_HangHoa = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieubanhang.khoxuat_id, null, loadOptions)
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
            title: 'DANH SÁCH HÀNG HÓA ĐẶT CHỜ BÁN - KHÔNG THEO THỜI GIAN', // và nhiều hơn thế nữa
            khachhangSelected: this.phieubanhang.khachhang_id
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachHangHoaDatHangThanhPhamComponent, { class: 'modal-xxl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            if (result) {
                let res: HangHoaThanhPham[] = [];
                if(result.action == 'capnhat'){
                    // chỉ lấy những hàng hoá nào chưa được chọn trước đó
                    res = result.data.filter(o=> !this.hanghoas.some(i=> i.phieudathang_thanhpham_id === o.id));
                }
                else{
                    this.hanghoas = <PhieuBanHang_ChiTiet[]>[];
                    res = result.data;
                }

                res.forEach((value) => {
                    let item: PhieuBanHang_ChiTiet = new PhieuBanHang_ChiTiet();
                 
                    item.loaihanghoa = value.loaihanghoa;
                    item.hanghoa_id = value.thanhpham_id;
                    item.hanghoa_lohang_id = null ; //value.hanghoa_lohang_id;
                    item.dvt_id = value.dvt_id;
                    item.tilequydoi = value.tilequydoi;
                    item.soluong = (value.soluong - value.soluongtattoan - value.soluongdaban) / value.tilequydoi;
                    item.chuthich = null; //value.chuthich;
                    item.tenhanghoa_inphieu = value.tenthanhpham; //value.tenhanghoa_inphieu;
                    item.phieudathang_thanhpham_id = value.id;

                    // add arr hanghoas
                    this.hanghoas.push(item);
                });
                this.isValidForm=true;
                this.phieubanhang.khachhang_id = res[0].khachhang_id;
            }
        });
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            //không chọn từ phiếu
            if (!this.firstLoad_KhachHang) {
                let khachhang = this.lstKhachHang.find((x) => x.id == this.phieubanhang.khachhang_id);

                this.phieubanhang.khachhang_dienthoai = khachhang ? khachhang.sodienthoai : null;
                this.phieubanhang.khachhang_diachi = khachhang ? khachhang.diachi : null;
                this.phieubanhang.khachhang_hoten = khachhang ? khachhang.tenkhachhang : null;
            }
             else {
                this.firstLoad_KhachHang = false; //chọn từ phiếu
            }

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieubanhang.khachhang_id, this.currentChiNhanh.id, this.phieubanhang.sort).subscribe((data) => {
                    this.phieubanhang.nocu = data;
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
            this.onCheckVAT();
        } else if (e.value == 0) {
            this.onCheckVAT();
        }

        // nếu thay đổi kho xuất -> set khoxuat_id cho hàng hoá
        if (e.dataField == 'khoxuat_id') {
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieubanhang.khoxuat_id;
            });
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuBanHang_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    onCheckVAT() {
        this.hanghoas.forEach((v, i) => {
            if (v.thuevat != 0 || this.phieubanhang.thuevat != 0) v.xuathoadon = true;
            else v.xuathoadon = false;
        });
    }

    checkCoLayThue(params) {
        let valid = true;
        if (this.phieubanhang.thuevat != 0 && params.value == false) {
            valid = false;
        } else {
            //nếu nguoi dung check vat va khong nhập % bao nhiêu thì sao?
        }

        return new Promise((resolve) => {
            setTimeout(function () {
                resolve(valid);
            }, 300);
        });
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            //return;
        } else {
            this.onCheckVAT();
            this.hanghoas[index].khoxuat_id = this.phieubanhang.khoxuat_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

            this.hanghoas[index].dongia = 0;
            this.commonService.hangHoa_LayGia_XuatKho(this.phieubanhang.khachhang_id, selected.id).toPromise().then((data) => {
                this.hanghoas[index].dongia = data ? data : 0;
                this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
            });
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].m3 = selected.m3;
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
                    this.phieubanhang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.hanghoas[index].xuathoadon = true;
                    this.phieubanhang.thuevat = 0;
                } else if (this.phieubanhang.thuevat == 0) {
                    this.hanghoas[index].xuathoadon = false;
                }
                break;
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    clickLayGia() {
        this.hanghoas.forEach((e) => {
            if (e.hanghoa_id != null)
                this.subscriptions.add(
                    this.phieubanhangService.laygiaTheoBangGia(e.hanghoa_id, e.xuathoadon, e.thuevat, this.phieubanhang.khachhang_id).subscribe((x) => {
                        e.dongia = x;
                    })
                );
        });
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongthanhtien: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.tongtrongluong = v.soluong * v.trongluong;
            v.tongkien       = v.tilequydoiphu > 0 ? v.soluong / v.tilequydoiphu : 0;
            v.tongm3         = v.soluong * v.m3;
            v.soluongconlai  = v.soluong - v.soluongdaxuat;

            let chietkhau = this.phieubanhang.chietkhau != 0 ? this.phieubanhang.chietkhau : v.chietkhau;
            let thuevat   = this.phieubanhang.thuevat   != 0 ? this.phieubanhang.thuevat   : v.thuevat  ;
            v.dongiavat = v.dongia - v.dongia * chietkhau + (v.dongia - v.dongia * chietkhau) * thuevat ;
            
            // làm tròn đơn giá vat và thành tiền
            v.dongiavat = Math.round(v.dongiavat);
            v.thanhtien = v.dongiavat * v.soluong;

            tongthanhtien += v.thanhtien;
        });
        this.phieubanhang.tongthanhtien = tongthanhtien;
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuBanHang.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);

        let phieubanhang_req = this.phieubanhang;

        // gán lại dữ liệu
        phieubanhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieubanhang_req.phieubanhang_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieubanhangService.addPhieuBanHang(phieubanhang_req).subscribe(
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
                    this.router.navigate(['/phieu-ban-hang']);
                    this.frmPhieuBanHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieubanhangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
