import { ChiNhanh, PhieuNhapChuyenKho, PhieuNhapChuyenKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AppInfoService, CommonService, KhoHangService, PhieuXuatChuyenKhoService, PhieuNhapChuyenKhoService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';
import { DanhSachPhieuXuatChuyenKhoModalComponent } from '../../modals/danh-sach-phieu-xuat-chuyen-kho-modal/danh-sach-phieu-xuat-chuyen-kho-modal.component';
import CustomStore from 'devextreme/data/custom_store';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';

@Component({
    selector: 'app-phieu-nhap-chuyen-kho-them-moi',
    templateUrl: './phieu-nhap-chuyen-kho-them-moi.component.html',
    styleUrls: ['./phieu-nhap-chuyen-kho-them-moi.component.css']
})
export class PhieuNhapChuyenKhoThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapChuyenKho: DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieunhapchuyenkho: PhieuNhapChuyenKho;
    public lstKhoHang: KhoHang[] = [];
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapChuyenKho_ChiTiet[] = [];
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
        public sumTotal: SumTotalPipe,
        public appInfoService: AppInfoService,
        private commonService: CommonService,
        private routeInterceptorService: RouteInterceptorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private objPhieuXuatChuyenKhoService: PhieuXuatChuyenKhoService,
        private phieunhapchuyenkhoService: PhieuNhapChuyenKhoService,
        private nhacungcapService: KhoHangService,
        private hanghoaService: HangHoaService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapChuyenKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieunhapchuyenkho = new PhieuNhapChuyenKho();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.subscriptions.add(
                    this.nhacungcapService.findKhoHangs(x.id).subscribe((x) => {
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
                // chọn từ phiếu mua hàng
                if (this.commonService.isNotEmpty(params.tuphieuxuatchuyenkho)) {
                    // cho hiển thị danh sách hàng hoá
                    this.isValidForm = true;
                    this.hanghoas = [];

                    /* chọn từ phiếu không cho thay đổi chi nhánh */
                    setTimeout(() => {
                        this.authenticationService.setDisableChiNhanh(true);
                    });

                    // lấy thông tin phiếu mua hàng từ api
                    this.objPhieuXuatChuyenKhoService.findPhieuXuatChuyenKho(params.tuphieuxuatchuyenkho).subscribe(
                        (data) => {
                            /* phiếu mua hàng -> phiếu nhập kho */
                            // xử lý phần thông tin phiếu
                            this.phieunhapchuyenkho.khoxuatchuyen_id = data.khoxuatchuyen_id;
                            this.phieunhapchuyenkho.khonhap_id = data.khonhap_id;
                            this.phieunhapchuyenkho.phieuxuatchuyenkho_id = data.id;
                            this.phieunhapchuyenkho.maphieuxuatchuyenkho = data.maphieuxuatchuyenkho;

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieuxuatchuyenkho_chitiets.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieuxuatchuyenkho_chitiets.forEach((value, index) => {
                                if (value.trangthainhap != ETrangThaiPhieu.danhap) {
                                    let chitiet = new PhieuNhapChuyenKho_ChiTiet();
                                    chitiet.khonhap_id = this.phieunhapchuyenkho.khonhap_id;
                                    chitiet.loaihanghoa = value.loaihanghoa;
                                    chitiet.hanghoa_id = value.hanghoa_id;
                                    chitiet.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    chitiet.dvt_id = value.dvt_id;
                                    chitiet.tilequydoi = value.tilequydoi;

                                    chitiet.soluong = value.soluong - value.soluongdanhap / value.tilequydoi;
                                    chitiet.dongia = value.dongia;
                                    chitiet.thanhtien = value.thanhtien;
                                    chitiet.chuthich = value.chuthich;

                                    // mua hàng không quản lý tên hàng hoá in phiếu
                                    // chitiet.tenhanghoa_inphieu = value.tenhanghoa_inphieu;

                                    chitiet.phieuxuatchuyenkho_chitiet_id = value.id;

                                    this.hanghoas.push(chitiet);
                                }
                            });
                        },
                        (error) => {
                            this.phieunhapchuyenkhoService.handleError(error);
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
            title: 'DANH SÁCH PHIẾU XUẤT CHUYỂN KHO' // và nhiều hơn thế nữa
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuXuatChuyenKhoModalComponent, { class: 'modal-xxl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-nhap-chuyen-kho/them-moi`], { queryParams: { tuphieuxuatchuyenkho: result.id } });
        });
    }

    onFormFieldChanged(e) {
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            // this.isValidForm = true;

            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapchuyenkho.khonhap_id;
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

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        //this.hanghoas.push(new PhieuNhapChuyenKho_ChiTiet());
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

            setTimeout(() => {
                this.hanghoas[index].mahanghoa = selected.mahanghoa;
                this.hanghoas[index].tenhanghoa = selected.tenhanghoa;
                this.hanghoas[index].dvt_id = selected.dvt_id;
                this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
            });
        } else {
            this.hanghoas[index].khonhap_id = this.phieunhapchuyenkho.khonhap_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;

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
            /* case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieunhapchuyenkho.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieunhapchuyenkho.thuevat = 0;
                }
                break; */
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.tongtrongluong = v.soluong * v.trongluong;
            v.tongkien       = v.tendonvitinhphu ? v.soluong / v.tilequydoiphu : 0;
            v.tongm3         = v.soluong * v.m3;
            v.soluongconlai  = v.soluong;

            v.thanhtien = v.soluong * v.dongia;
            tongtienhang += v.thanhtien;
        });
        //this.phieunhapchuyenkho.tongtienhang = tongtienhang;
        //this.phieunhapchuyenkho.tongthanhtien = tongtienhang - tongtienhang * this.phieunhapchuyenkho.chietkhau + (tongtienhang - tongtienhang * this.phieunhapchuyenkho.chietkhau) * this.phieunhapchuyenkho.thuevat;
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuNhapChuyenKho.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieunhapchuyenkho_req = this.phieunhapchuyenkho;

        // gán lại dữ liệu
        phieunhapchuyenkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapchuyenkho_req.phieunhapchuyenkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapchuyenkhoService.addPhieuNhapChuyenKho(phieunhapchuyenkho_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-chuyen-kho']);
                    this.frmPhieuNhapChuyenKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhapchuyenkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
