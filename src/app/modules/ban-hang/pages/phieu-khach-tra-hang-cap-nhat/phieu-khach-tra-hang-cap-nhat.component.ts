import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, PhieuKhachTraHang, KhachHang, KhoHang, NguoiDung, PhieuKhachTraHang_ChiTiet } from '@app/shared/entities';
import {
    AppInfoService,
    CommonService,
    RouteInterceptorService,
    PhieuBanHangService,
    PhieuKhachTraHangService,
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
    selector: 'app-phieu-khach-tra-hang-cap-nhat',
    templateUrl: './phieu-khach-tra-hang-cap-nhat.component.html',
    styleUrls: ['./phieu-khach-tra-hang-cap-nhat.component.css']
})
export class PhieuKhachTraHangCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuKhachTraHang: DxFormComponent;

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

    public firstLoad_KhachHang = true;

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

        private objPhieuBanHangService: PhieuBanHangService,
        private phieukhachtrahangService: PhieuKhachTraHangService,
        private khachhangService: KhachHangService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        private nguoidungService: NguoiDungService
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
            })
        );
        // ? lấy danh sách kho hàng theo chi nhánh hiện tại
        this.loadingVisible = true;
        this.subscriptions.add(
            this.khohangService.findKhoHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhoHang = x;
                this.dataSource_KhoHang = new DataSource({
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
            this.hanghoaService.findHangHoas(this.appInfoService.loaihanghoa_nguyenlieu).subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieukhachtrahang_id = params.id;
                // lấy thông tin
                if (phieukhachtrahang_id) {
                    this.subscriptions.add(
                        this.phieukhachtrahangService.findPhieuKhachTraHang(phieukhachtrahang_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieukhachtrahang_chitiet.length;

                                this.phieukhachtrahang = data;
                                this.hanghoas = this.phieukhachtrahang.phieukhachtrahang_chitiet;
                            
                            },
                            (error) => {
                                this.phieukhachtrahangService.handleError(error);
                            }
                        )
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

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            if (!this.firstLoad_KhachHang) {
                let khachhang = this.lstKhachHang.find((x) => x.id == this.phieukhachtrahang.khachhang_id);

                this.phieukhachtrahang.khachhang_dienthoai = khachhang.sodienthoai;
                this.phieukhachtrahang.khachhang_diachi = khachhang.diachi;
                this.phieukhachtrahang.khachhang_hoten = khachhang.tenkhachhang;
                
            } else {
                this.firstLoad_KhachHang = false;
            }

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieukhachtrahang.khachhang_id, this.phieukhachtrahang.sort).subscribe((data) => {
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
        this.onTinhTong();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuKhachTraHang_ChiTiet());
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
            this.hanghoas[index].dvt_id = selected.tendonvitinh;
            this.hanghoas[index].tenhanghoabanhang_inphieu = selected.tnhanghoa;

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
        this.phieukhachtrahang.tongtienhang = tongtienhang;
        this.phieukhachtrahang.tongthanhtien =
            tongtienhang - tongtienhang * this.phieukhachtrahang.chietkhau + (tongtienhang - tongtienhang * this.phieukhachtrahang.chietkhau) * this.phieukhachtrahang.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieukhachtrahang_req = this.phieukhachtrahang;

        // gán lại dữ liệu
        phieukhachtrahang_req.chinhanh_id = this.currentChiNhanh.id;
        phieukhachtrahang_req.phieukhachtrahang_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieukhachtrahangService.updatePhieuKhachTraHang(phieukhachtrahang_req).subscribe(
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
