import { ChiNhanh, PhieuNhapTraMuonHang, PhieuNhapTraMuonHang_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, ChiNhanhService, CommonService, KhoHangService, PhieuNhapTraMuonHangService, PhieuXuatMuonHangService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DanhSachPhieuXuatMuonHangModalComponent } from '../../modals/danh-sach-phieu-xuat-muon-hang-modal/danh-sach-phieu-xuat-muon-hang-modal.component';
import { ETrangThaiPhieu } from '@app/shared/enums/e-trang-thai-phieu.enum';

@Component({
    selector: 'app-phieu-nhap-tra-muon-hang-them-moi',
    templateUrl: './phieu-nhap-tra-muon-hang-them-moi.component.html',
    styleUrls: ['./phieu-nhap-tra-muon-hang-them-moi.component.css']
})
export class PhieuNhapTraMuonHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapTraMuonHang: DxFormComponent;
    bsModalRef: BsModalRef;
    
    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieunhaptramuonhang: PhieuNhapTraMuonHang;
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public lstKhoXuat: KhoHang[] = [];
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapTraMuonHang_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = true;

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

        private phieunhaptramuonhangService: PhieuNhapTraMuonHangService,
        private phieuxuatmuonhangService: PhieuXuatMuonHangService,
        private chinhanhService: ChiNhanhService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapTraMuonHang.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieunhaptramuonhang = new PhieuNhapTraMuonHang();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.phieunhaptramuonhang.chinhanh_id = x.id;

                // tất cả kho, sau đó lọc lại theo điều kiện
                this.subscriptions.add(
                    this.khohangService.findKhoHangs().subscribe((x) => {
                        this.loadingVisible = false;
                        
                        this.lstKhoNhap = x.filter(z => z.chinhanh_id == this.currentChiNhanh.id && z.khongoai != true);
                        this.dataSource_KhoNhap = new DataSource({
                            store: this.lstKhoNhap,
                            paginate: true,
                            pageSize: 50
                        });

                        this.lstKhoXuat = x.filter(z => z.chinhanh_id != this.currentChiNhanh.id || z.khongoai == true);
                        this.dataSource_KhoXuat = new DataSource({
                            store: this.lstKhoXuat,
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

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tuphieu)) {
                    this.hanghoas = [];
                    // lấy thông tin phiếu đặt hàng ncc từ api
                    this.phieuxuatmuonhangService.findPhieuXuatMuonHang(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            /* phiếu đặt hàng ncc -> phiếu mua hàng ncc */
                            // xử lý phần thông tin phiếu
                            this.phieunhaptramuonhang.phieuxuatmuonhang_id = data.id;
                            this.phieunhaptramuonhang.khonhap_id = data.khoxuat_id; // xuất kho nào ưu tiên nhập kho đó
                            this.phieunhaptramuonhang.khoxuat_id = data.khonhap_id;
                            this.phieunhaptramuonhang.matuphieu = data.maphieuxuatmuonhang;

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieuxuatmuonhang_chitiets.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieuxuatmuonhang_chitiets.forEach((value, index) => {
                                if (value.trangthaitra != ETrangThaiPhieu.datra) {
                                    let item = new PhieuNhapTraMuonHang_ChiTiet();

                                    item.khonhap_id = this.phieunhaptramuonhang.khonhap_id;
                                    item.loaihanghoa = value.loaihanghoa;
                                    item.hanghoa_id = value.hanghoa_id;
                                    item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                    item.dvt_id = value.dvt_id;
                                    item.tilequydoi = value.tilequydoi;
                                    item.soluong = value.soluong - value.soluongdatra / value.tilequydoi;

                                    item.chuthich = value.chuthich;
                                    item.phieuxuatmuonhang_chitiet_id = value.id;

                                    this.hanghoas.push(item);
                                }
                            });
                        },
                        (error) => {
                            this.phieunhaptramuonhangService.handleError(error);
                        }
                    );
                }
            })
        );

        // thêm sẵn 1 dòng cho user
        this.onHangHoaAdd();
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    openModal() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH PHIẾU XUẤT MƯỢN HÀNG' // và nhiều hơn thế nữa
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuXuatMuonHangModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-nhap-tra-muon-hang/them-moi`], { queryParams: { tuphieu: result.id } });
        });
    }
    
    onFormFieldChanged(e) {
        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhaptramuonhang.khonhap_id;
            });
            //this.frmPhieuNhapTraMuonHang.instance.validate();
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.frmPhieuNhapTraMuonHang.instance.validate();
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        //this.hanghoas.push(new PhieuNhapTraMuonHang_ChiTiet());
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
            });
        } else {
            this.hanghoas[index].khonhap_id = this.phieunhaptramuonhang.khonhap_id;
            this.hanghoas[index].mahanghoa = selected.mahanghoa;

            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            //this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            //this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
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
        // switch (col) {
        //     case 'soluong':
        //         this.hanghoas[index].soluong = e.value;
        //         break;
        //     case 'dongia':
        //         this.hanghoas[index].dongia = e.value;
        //         break;
        // }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        // let tongtienhang: number = 0;
        // this.hanghoas.forEach((v, i) => {
        //     v.thanhtien = v.soluong * v.dongia;
        //     tongtienhang += v.thanhtien;
        // });
        // this.phieunhaptramuonhang.tongthanhtien = tongtienhang;
    }

    public onSubmitForm(e) {
        if(!this.frmPhieuNhapTraMuonHang.instance.validate().isValid) return;
        
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieunhaptramuonhang_req = this.phieunhaptramuonhang;

        // gán lại dữ liệu
        phieunhaptramuonhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhaptramuonhang_req.phieunhaptramuonhang_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhaptramuonhangService.addPhieuNhapTraMuonHang(phieunhaptramuonhang_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-tra-muon-hang']);
                    this.frmPhieuNhapTraMuonHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhaptramuonhangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
