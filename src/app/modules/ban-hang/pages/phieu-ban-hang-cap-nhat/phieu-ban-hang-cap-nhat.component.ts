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
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

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
    public phieudathang: PhieuDatHang;
    public lstKhachHang: KhachHang[] = [];
    public lstKhoHang: KhoHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];

    public hanghoas: PhieuBanHang_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};
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

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieubanhang = new PhieuBanHang();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas(this.appInfoService.loaihanghoa_nguyenlieu).subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhachHang = x;
            })
        );

        this.subscriptions.add(
            this.khohangService.findKhoHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhoHang = x;
            })
        );

        this.subscriptions.add(
            this.nguoidungService.findNguoiDungs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNguoiDung = x;
            })
        );

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

                                this.phieubanhang.khachhang = this.lstKhachHang.find((o) => o.id == this.phieubanhang.khachhang_id);
                                this.phieubanhang.khoxuat = this.lstKhoHang.find((o) => o.id == this.phieubanhang.khoxuat_id);
                                this.phieubanhang.nguoidung = this.lstNguoiDung.find((o) => o.id == this.phieubanhang.nhanviensale_id);
                            },
                            (error) => {
                                this.phieubanhangService.handleError(error);
                            }
                        )
                    );

                    
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
        if (e.dataField == 'khachhang') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            this.phieubanhang.khachhang_dienthoai = e.value ? e.value.sodienthoai : null;
            this.phieubanhang.khachhang_diachi = e.value ? e.value.diachi : null;
            this.phieubanhang.khachhang_hoten = e.value ? e.value.tenkhachhang : null;
            //this.phieubanhang.khoxuat_id =  e .value ? e.value.tenkhohang :null;
            this.phieubanhang.khachhang_id = e.value ? e.value.id : null;

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieubanhang.khachhang_id, this.phieubanhang.sort).subscribe((data) => {
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
        }

        // tính tổng tiền
        this.onTinhTong();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuBanHang_ChiTiet());
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
            //return;
        } else {
            this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
            this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

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
                    this.phieubanhang.thuevat = 0;
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
        this.phieubanhang.tongtienhang = tongtienhang;
        this.phieubanhang.tongthanhtien = tongtienhang - tongtienhang * this.phieubanhang.chietkhau + (tongtienhang - tongtienhang * this.phieubanhang.chietkhau) * this.phieubanhang.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieubanhang_req = this.phieubanhang;

        // gán lại dữ liệu
        phieubanhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieubanhang_req.khachhang_id = this.phieubanhang.khachhang.id;
        phieubanhang_req.nhanviensale_id = this.phieubanhang.nguoidung.id;
        phieubanhang_req.khoxuat_id = this.phieubanhang.khoxuat.id;
        phieubanhang_req.phieubanhang_chitiet = hanghoas;

        this.saveProcessing = true;
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