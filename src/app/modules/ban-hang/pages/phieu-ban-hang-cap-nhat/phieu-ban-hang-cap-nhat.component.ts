import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, PhieuBanHang, PhieuDatHang, KhachHang, KhoHang, NguoiDung, PhieuBanHang_ChiTiet } from '@app/shared/entities';
import {
    AppInfoService,
    CommonService,
    RouteInterceptorService,
    PhieuBanHangService,
    PhieuDatHangService,
    KhachHangService,
    HangHoaService,
    KhoHangService,
    NguoiDungService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-phieu-ban-hang-cap-nhat',
    templateUrl: './phieu-ban-hang-cap-nhat.component.html',
    styleUrls: ['./phieu-ban-hang-cap-nhat.component.css']
})
export class PhieuBanHangCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuBangHang: DxFormComponent;

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

    public firstLoad_KhachHang = true;

    public hanghoas: PhieuBanHang_ChiTiet[] = [];

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // tất toán
    public isTatToan: boolean = false;

    // duyệt giá
    public isDuyetGia: boolean = false;

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
        private phieubanhangService: PhieuBanHangService,
        private objPhieuDatHangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        private nguoidungService: NguoiDungService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuMuaHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }
    asyncValidation: Function;

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
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

        this.loadingVisible = true;
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieubanhang_id = params.id;
                // lấy thông tin
                if (phieubanhang_id) {
                    this.subscriptions.add(
                        this.phieubanhangService.findPhieuBanHang(phieubanhang_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieubanhang_chitiet.length;

                                this.phieubanhang = data;
                                this.hanghoas = this.phieubanhang.phieubanhang_chitiet;
                                
                                this.saveProcessing = this.phieubanhang.duyetgia; // duyệt giá rồi không cho lưu nữa
                            },
                            (error) => {
                                this.phieubanhangService.handleError(error);
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
                if (this.commonService.isNotEmpty(params.duyetgia)) {
                    this.isDuyetGia = true;
                }
            })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            if (!this.firstLoad_KhachHang) {
                let khachhang = this.lstKhachHang.find((x) => x.id == this.phieubanhang.khachhang_id);

                this.phieubanhang.khachhang_dienthoai = khachhang ? khachhang.sodienthoai : null;
                this.phieubanhang.khachhang_diachi = khachhang ? khachhang.diachi : null;
                this.phieubanhang.khachhang_hoten =  khachhang ? khachhang.tenkhachhang : null;
            } else {
                this.firstLoad_KhachHang = false;
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
        }else if(e.value == 0){
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

    onCheckVAT(){
        if (this.hanghoalenght == 0) {
            this.hanghoas.forEach((v, i) => {
                if(v.thuevat != 0 || this.phieubanhang.thuevat != 0)
                    v.xuathoadon = true;
                else
                    v.xuathoadon = false;
            });
        }
    }

    checkCoLayThue(params) {
        let valid = true;
        if (this.phieubanhang.thuevat != 0 && params.value == false) {
            valid = false;
        } else {
            // this.hanghoas
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
                    this.phieubanhang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.hanghoas[index].xuathoadon = true;
                    this.phieubanhang.thuevat = 0;
                }
                else if(this.phieubanhang.thuevat == 0){
                    this.hanghoas[index].xuathoadon = false;
                }
                break;
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        // tính tổng tiền hàng và tổng thành tiền sau chiết khấu

        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.thanhtien = (v.soluong - v.soluongtattoan) * v.dongia;
            v.thanhtien = v.thanhtien - v.thanhtien * v.chietkhau + (v.thanhtien - v.thanhtien * v.chietkhau) * v.thuevat;

            tongtienhang += v.thanhtien;
        });
        this.phieubanhang.tongtienhang = tongtienhang;
        this.phieubanhang.tongthanhtien = tongtienhang - tongtienhang * this.phieubanhang.chietkhau + (tongtienhang - tongtienhang * this.phieubanhang.chietkhau) * this.phieubanhang.thuevat;
    }

    onDuyetGia() {
        // hỏi xác nhận 1 lần trước khi duyệt giá
        Swal.fire({
            title: !this.phieubanhang.duyetgia ? 'DUYỆT GIÁ BÁN?' : 'HUỶ DUYỆT GIÁ?',
            text: 'Bạn có muốn tiếp tục!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: `Không`,
            confirmButtonText: `Đồng ý, ${!this.phieubanhang.duyetgia ? 'duyệt' : 'huỷ duyệt'}!`
        }).then((result) => {
            if (result.isConfirmed) {
                // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
                let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
                let phieubanhang_req = this.phieubanhang;

                // gán lại dữ liệu
                phieubanhang_req.chinhanh_id = this.currentChiNhanh.id;
                phieubanhang_req.phieubanhang_chitiet = hanghoas;

                this.phieubanhang.duyetgia = !this.phieubanhang.duyetgia;
                this.subscriptions.add(
                    this.phieubanhangService.updateDuyetGiaPhieuBanHang(phieubanhang_req).subscribe(
                        (data) => {
                            notify(
                                {
                                    width: 320,
                                    message: (this.phieubanhang.duyetgia ? 'DUYỆT GIÁ' : 'HUỶ DUYỆT GIÁ') + ' THÀNH CÔNG',
                                    position: { my: 'right top', at: 'right top' }
                                },
                                'success',
                                475
                            );
                            this.router.navigate(['/phieu-ban-hang']);
                        },
                        (error) => {
                            this.phieubanhang.duyetgia = !this.phieubanhang.duyetgia;
                            this.phieubanhangService.handleError(error);
                        }
                    )
                );
            }
        });
    }

    onValid(){
        if(this.phieubanhang.duyetgia == true){
            Swal.fire({
                title: 'Phiếu đã duyệt giá không sửa được',
                html: 'Vui lòng kiểm tra lại',
                icon: 'warning',
                timer: 3000,
                timerProgressBar: true
            });
            return false;
        }
        return true;
    }

    public onSubmitForm(e) {
        if(!this.onValid()) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieubanhang_req = this.phieubanhang;

        // gán lại dữ liệu
        phieubanhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieubanhang_req.phieubanhang_chitiet = hanghoas;

        // chỉnh sửa trên function này nhớ kiểm tra func onDuyetGia()
        this.saveProcessing = true;
        if (this.isTatToan)
            this.subscriptions.add(
                this.phieubanhangService.updateTatToanPhieuBanHang(phieubanhang_req).subscribe(
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
                        this.frmPhieuBangHang.instance.resetValues();
                        this.saveProcessing = false;
                    },
                    (error) => {
                        this.phieubanhangService.handleError(error);
                        this.saveProcessing = false;
                    }
                )
            );
        else
            this.subscriptions.add(
                this.phieubanhangService.updatePhieuBanHang(phieubanhang_req).subscribe(
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
                        this.frmPhieuBangHang.instance.resetValues();
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
