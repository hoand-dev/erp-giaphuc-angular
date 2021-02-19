import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, PhieuDatHang, KhachHang, NguoiDung, KhoHang, PhieuDatHang_ChiTiet } from '@app/shared/entities';
import { AppInfoService, PhieuDatHangService, KhachHangService, HangHoaService, NguoiDungService, KhoHangService, CommonService } from '@app/shared/services';
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

    public hanghoas: PhieuDatHang_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private phieudathangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private nguoidungService: NguoiDungService,
        private khohangService: KhoHangService,

        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) { }

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

        this.dataSource_HangHoa = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: "id",
                load: (loadOptions) => {
                    return this.commonService.hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieudathang.khoxuat_id, null, loadOptions)
                        .toPromise()
                        .then(result => {
                            return result;
                        });
                },
                byKey: (key) => {
                    return this.hanghoaService.findHangHoa(key)
                        .toPromise()
                        .then(result => {
                            return result;
                        });
                }
            })
        });

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

                                this.phieudathang = data;
                                this.hanghoas = this.phieudathang.phieudathang_chitiet;
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

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuDatHang_ChiTiet());
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
            this.hanghoas[index].khoxuat_id = this.phieudathang.khoxuat_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;
            
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
            case 'soluongtattoan':
                this.hanghoas[index].soluongtattoan = e.value;
                break;
            case 'soluong':
                this.hanghoas[index].soluong = e.value;
                break;
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieudathang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieudathang.thuevat = 0;
                }
                break;
        }

        // tính tiền sau chiết khấu
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

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.thanhtien = (v.soluong - v.soluongtattoan) * v.dongia;
            v.thanhtien = v.thanhtien - v.thanhtien * v.chietkhau + (v.thanhtien - v.thanhtien * v.chietkhau) * v.thuevat;

            tongtienhang += v.thanhtien;
        });
        this.phieudathang.tongtienhang = tongtienhang;
        this.phieudathang.tongthanhtien = tongtienhang - tongtienhang * this.phieudathang.chietkhau + (tongtienhang - tongtienhang * this.phieudathang.chietkhau) * this.phieudathang.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieudathang_req = this.phieudathang;

        // gán lại dữ liệu
        phieudathang_req.chinhanh_id = this.currentChiNhanh.id;
        phieudathang_req.phieudathang_chitiet = hanghoas;

        this.saveProcessing = true;

        if(this.isTatToan)
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
