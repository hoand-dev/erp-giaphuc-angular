import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, PhieuDatHang, KhachHang, NguoiDung, KhoHang, PhieuDatHang_ChiTiet, DinhMuc, HangHoa, PhieuDatHang_SanXuatChiTiet, SoMat, PhieuDatHang_ThanhPham } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { AppInfoService, PhieuDatHangService, KhachHangService, HangHoaService, NguoiDungService, KhoHangService, CommonService, DinhMucService, SoMatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-dat-hang-cap-nhat',
    templateUrl: './phieu-dat-hang-cap-nhat.component.html',
    styleUrls: ['./phieu-dat-hang-cap-nhat.component.css']
})
export class PhieuDatHangCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuDatHang: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieudathang: PhieuDatHang;

    public lstKhachHang: KhachHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];
    public lstKhoHang: KhoHang[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_NguoiDung: DataSource;
    public dataSource_KhoHang: DataSource;

    public fisrtLoad_KhachHang = true;

    // trạng thái process
    public saveProcessing = false;
    public loadingVisible = true;

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // tất toán
    public isTatToan: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    private sxhanghoalenght: number = 0;
    private sxhanghoalenght_yeucau: number = 0;
    private sxhanghoalenght_somat: number = 0;
    private sxhanghoalenght_somat_thanhpham: number = 0;

    public lstHangHoa: HangHoa[];
    public lstGiaCong: DinhMuc[];
    public lstSoMat: SoMat[];

    public hanghoas: PhieuDatHang_ChiTiet[] = [];
    public hanghoas_sanxuat: PhieuDatHang_SanXuatChiTiet[] = [];
    public hanghoas_thanhpham: PhieuDatHang_ThanhPham[] = [];

    public dataSource_HangHoa: DataSource;
    public dataSource_HangHoaSX: DataSource;
    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public sumTotal: SumTotalPipe,
        public appInfoService: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private phieudathangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private nguoidungService: NguoiDungService,
        private khohangService: KhoHangService,

        private hanghoaService: HangHoaService,
        private giacongService: DinhMucService,
        private somatService: SoMatService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuDatHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    asyncValidation: Function;

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieudathang = new PhieuDatHang();
        this.asyncValidation = this.checkGiuHang.bind(this);

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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieudathang.khoxuat_id, null, loadOptions)
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

        this.dataSource_HangHoaSX = this.dataSource_HangHoa;

        this.loadingVisible = true;
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieudathang_id = params.id;
                // lấy thông tin định mức
                if (phieudathang_id) {
                    this.subscriptions.add(
                        this.phieudathangService.findPhieuDatHang(phieudathang_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieudathang_chitiet.length;

                                this.sxhanghoalenght = data.phieudathang_sanxuatchitiets.length;
                                this.sxhanghoalenght_yeucau = data.phieudathang_sanxuatchitiets.length;
                                this.sxhanghoalenght_somat = data.phieudathang_sanxuatchitiets.length;
                                this.sxhanghoalenght_somat_thanhpham = data.phieudathang_sanxuatchitiets.length;

                                this.phieudathang = data;
                                this.hanghoas = this.phieudathang.phieudathang_chitiet;
                                this.hanghoas_sanxuat = this.phieudathang.phieudathang_sanxuatchitiets;
                                this.hanghoas_thanhpham = this.phieudathang.phieudathang_thanhphams;
                            },
                            (error) => {
                                this.phieudathangService.handleError(error);
                            }
                        )
                    );
                }
            })
        );

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tattoan)) {
                    this.isTatToan = true;
                }
            })
        );
    }

    dataSourceReload(index){
        this.dataSource_HangHoaSX = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.hanghoas_sanxuat[index].khoxuat_id, "hangtron,thanhpham", loadOptions)
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
    }

    ngOnDestroy(): void {
        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value != null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn khách hàng
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ
            if (!this.fisrtLoad_KhachHang) {
                let khachhang = this.lstKhachHang.find((o) => o.id == this.phieudathang.khachhang_id);

                this.phieudathang.khachhang_hoten = khachhang.tenkhachhang;
                this.phieudathang.khachhang_dienthoai = khachhang.sodienthoai;
                this.phieudathang.khachhang_diachi = khachhang.diachi;
            } else this.fisrtLoad_KhachHang = false;

            // load nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieudathang.khachhang_id, this.currentChiNhanh.id, this.phieudathang.sort).subscribe((data) => {
                    this.phieudathang.nocu = data;
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

        // thay đổi check giữ hàng
        if (e.dataField == 'giuhang') {
            if (e.value == false)
                //this.frmPhieuDatHang.instance.getEditor('khoxuat').reset();
                this.phieudathang.khoxuat_id = null;
            this.frmPhieuDatHang.instance.validate();
        }

        // nếu thay đổi kho xuất -> set khoxuat_id cho hàng hoá
        if (e.dataField == 'khoxuat_id') {
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieudathang.khoxuat_id;
            });
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    checkGiuHang(params) {
        let valid = true;
        if (this.phieudathang.giuhang && params.value == null) {
            valid = false;
        }

        return new Promise((resolve) => {
            setTimeout(function () {
                resolve(valid);
            }, 300);
        });
    }
    
    onYeuCauChanged(index, e) {
        if (this.sxhanghoalenght_yeucau > 0) {
            this.sxhanghoalenght_yeucau--;
        } else this.onTaoThanhPham(index);
    }

    onSoMatYeuCauChanged(index, e) {
        let selected = e.selectedItem;
        if (this.sxhanghoalenght_somat > 0) {
            this.sxhanghoalenght_somat--;
        } else {
            // gán số mặt cho thành phẩm
            this.hanghoas_sanxuat[index].somat_thanhpham_id = selected.id;

            // gán giá trị hệ số
            // this.hanghoas_sanxuat[index].heso = selected.giatri;
        }
    }

    onSoMatThanhPhamChanged(index, e) {
        let selected = e.selectedItem;
        if (this.sxhanghoalenght_somat_thanhpham > 0) {
            this.sxhanghoalenght_somat_thanhpham--;
        } else {
            /* tạo lại mã mới cho thành phẩm */
            this.onTaoThanhPham(index);
        }
    }

    onTaoThanhPham(index) {
        if (this.hanghoas_sanxuat[index].hanghoa_id != null) {
            let somat = this.lstSoMat.find((x) => x.id == this.hanghoas_sanxuat[index].somat_thanhpham_id);
            let masomat: string = somat != null ? somat.masomat.toString().trim() : '';
            let tensomat: string = somat != null ? somat.tensomat.toString().trim() : '';

            let _: string = ' ';

            this.subscriptions.add(
                this.hanghoaService.findHangHoa(this.hanghoas_sanxuat[index].hanghoa_id).subscribe((x) => {
                    let hanghoa: HangHoa = x;
                    if (hanghoa != undefined) {
                        let idgiacongs_thanhpham: number[] = JSON.parse(hanghoa.idgiacongs);

                        let magiacong: string = '';
                        let tengiacong: string = '';
                        if (this.hanghoas_sanxuat[index].arr_yeucaus != null) {
                            this.hanghoas_sanxuat[index].arr_yeucaus.forEach((value, index) => {
                                let giacong = this.lstGiaCong.find((x) => x.id == value);
                                if (typeof giacong === 'object') {
                                    if (hanghoa.loaihanghoa == 'thanhpham' && idgiacongs_thanhpham !== null && !idgiacongs_thanhpham.includes(value)) {
                                        magiacong += giacong.madinhmuc;
                                        tengiacong += giacong.tendinhmuc + ' ';
                                    }
                                    if (hanghoa.loaihanghoa != 'thanhpham') {
                                        magiacong += giacong.madinhmuc;
                                        tengiacong += giacong.tendinhmuc + ' ';
                                    }
                                }
                            });
                            tengiacong = tengiacong.trim();
                        }

                        if (hanghoa.loaihanghoa == 'thanhpham') {
                            magiacong = magiacong + hanghoa.magiacong;
                            tengiacong = tengiacong + _ + hanghoa.tengiacong;
                        }

                        let mahanghoa: string = magiacong + masomat + hanghoa.matieuchuan + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + hanghoa.ncc + hanghoa.maloaihang;
                        let tenhanghoa: string =
                            tengiacong + _ + tensomat + _ + hanghoa.tentieuchuan + _ + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + _ + hanghoa.ncc + _ + hanghoa.tenloaihang;

                        this.hanghoas_sanxuat[index].mathanhpham = mahanghoa.split('null').join('').trim();
                        this.hanghoas_sanxuat[index].tenthanhpham = tenhanghoa.split('null').join('').trim();

                        if (this.hanghoas_sanxuat[index].arr_yeucaus.length > 0) this.hanghoas_sanxuat[index].yeucaus = this.hanghoas_sanxuat[index].arr_yeucaus.toString();
                    }
                })
            );
        }
    }

    public onHangHoaAdd(tabName: string = 'hangcosan') {
        if(this.isTatToan){
            return;
        }
        if (tabName == 'hangcosan') {
            this.hanghoas.push(new PhieuDatHang_ChiTiet());
        }
        if (tabName == 'sanxuat') {
            this.hanghoas_sanxuat.push(new PhieuDatHang_SanXuatChiTiet());
        }
    }

    public onHangHoaDelete(item, tabName: string = 'hangcosan') {
        if(this.isTatToan){
            return;
        }
        if (tabName == 'hangcosan') {
            this.hanghoas = this.hanghoas.filter(function (i) {
                return i !== item;
            });
        }
        if (tabName == 'sanxuat') {
            this.hanghoas_sanxuat = this.hanghoas_sanxuat.filter(function (i) {
                return i !== item;
            });
        }
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e, tabName: string = 'hangcosan') {
        let selected = e.selectedItem;

        if (tabName == 'hangcosan') {
            // xử lý lại thông tin dựa trên lựa chọn
            if (this.hanghoalenght > 0) {
                this.hanghoalenght--;
            } else {
                this.hanghoas[index].khoxuat_id = this.phieudathang.khoxuat_id;
                this.hanghoas[index].dvt_id = selected.dvt_id;
                this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;
    
                this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
                this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
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
        if (tabName == 'sanxuat') {
            if (this.sxhanghoalenght > 0) {
                this.sxhanghoalenght--;
                this.hanghoas_sanxuat[index].arr_yeucaus = JSON.parse(this.hanghoas_sanxuat[index].yeucaus);
                this.sxhanghoalenght_yeucau = this.hanghoas_sanxuat[index].arr_yeucaus.length;
                this.hanghoas_sanxuat[index].yeucaus = this.hanghoas_sanxuat[index].arr_yeucaus.toString();
            } else {
                this.hanghoas_sanxuat[index].dvt_id = selected.dvt_id;
            }

            this.hanghoas_sanxuat[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas_sanxuat[index].tilequydoiphu = selected.quydoi1;
            this.hanghoas_sanxuat[index].trongluong = selected.trongluong;
            this.hanghoas_sanxuat[index].m3 = selected.m3;
            this.hanghoas_sanxuat[index].tendonvitinh = selected.tendonvitinh;
            this.hanghoas_sanxuat[index].tendonvitinhphu = selected.tendonvitinhphu;

            this.onTaoThanhPham(index);

            // chỉ thêm row mới khi không tồn tài dòng rỗng nào
            let rowsNull = this.hanghoas_sanxuat.filter((x) => x.hanghoa_id == null);
            if (rowsNull.length == 0) {
                this.onHangHoaAdd('sanxuat');
            }
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        switch (col) {
            case 'soluong':
                //this.hanghoas[index].soluong = e.value;
                break;
            case 'dongia':
                //this.hanghoas[index].dongia = e.value;
                break;
            case 'chietkhau':
                // this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieudathang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                // this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieudathang.thuevat = 0;
                }
                break;
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongthanhtien: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.tongtrongluong = v.soluong * v.trongluong;
            v.tongkien       = v.tilequydoiphu > 0 ? v.soluong / v.tilequydoiphu : 0;
            v.tongm3         = v.soluong * v.m3;
            v.soluongconlai  = v.soluong - v.soluongdagiao - v.soluongtattoan;

            let chietkhau = this.phieudathang.chietkhau != 0 ? this.phieudathang.chietkhau : v.chietkhau;
            let thuevat   = this.phieudathang.thuevat   != 0 ? this.phieudathang.thuevat   : v.thuevat  ;
            let dongiavat = v.dongia - v.dongia * chietkhau + (v.dongia - v.dongia * chietkhau) * thuevat ;
            
            // làm tròn đơn giá vat và thành tiền
            dongiavat = Math.round(dongiavat);
            v.thanhtien = dongiavat * (v.soluong - v.soluongtattoan);

            tongthanhtien += v.thanhtien;
        });

        this.hanghoas_sanxuat.forEach((v, i) => {
            v.tongtrongluong = v.soluong * v.trongluong;
            v.tongkien       = v.tilequydoiphu > 0 ? v.soluong / v.tilequydoiphu : 0;
            v.tongm3         = v.soluong * v.m3;
            v.soluongconlai  = v.soluong - v.soluongtattoan;

            let chietkhau = this.phieudathang.chietkhau != 0 ? this.phieudathang.chietkhau : v.chietkhau;
            let thuevat   = this.phieudathang.thuevat   != 0 ? this.phieudathang.thuevat   : v.thuevat  ;
            let dongiavat = v.dongia - v.dongia * chietkhau + (v.dongia - v.dongia * chietkhau) * thuevat ;
            
            // làm tròn đơn giá vat và thành tiền
            dongiavat = Math.round(dongiavat);
            v.thanhtien = dongiavat * (v.soluong - v.soluongtattoan);

            tongthanhtien += v.thanhtien;
        });

        this.phieudathang.tongthanhtien = tongthanhtien;
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuDatHang.instance.validate().isValid) return;
        if (this.phieudathang.giuhang && this.phieudathang.khoxuat_id == null) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let hanghoas_sanxuat = this.hanghoas_sanxuat.filter((x) => {
            x.khogiacong_id = this.hanghoas_sanxuat[0].khogiacong_id;
            x.khoxuat_id = this.hanghoas_sanxuat[0].khoxuat_id;
            x.khonhap_id = this.hanghoas_sanxuat[0].khonhap_id;
            return x.hanghoa_id != null;
        });

        let phieudathang_req = this.phieudathang;

        // gán lại dữ liệu
        phieudathang_req.chinhanh_id = this.currentChiNhanh.id;
        phieudathang_req.phieudathang_chitiet = hanghoas;
        phieudathang_req.phieudathang_sanxuatchitiets = hanghoas_sanxuat;

        this.saveProcessing = true;

        if (this.isTatToan)
            this.subscriptions.add(
                this.phieudathangService.updateTatToanPhieuDatHang(phieudathang_req).subscribe(
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
                        this.frmPhieuDatHang.instance.resetValues();
                        this.saveProcessing = false;
                        this.router.navigate(['/phieu-dat-hang']);
                    },
                    (error) => {
                        this.phieudathangService.handleError(error);
                        this.saveProcessing = false;
                    }
                )
            );
        else
            this.subscriptions.add(
                this.phieudathangService.updatePhieuDatHang(phieudathang_req).subscribe(
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
                        this.frmPhieuDatHang.instance.resetValues();
                        this.saveProcessing = false;
                        this.router.navigate(['/phieu-dat-hang']);
                    },
                    (error) => {
                        this.phieudathangService.handleError(error);
                        this.saveProcessing = false;
                    }
                )
            );
        e.preventDefault();
    }
}
