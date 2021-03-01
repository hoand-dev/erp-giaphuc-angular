import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DanhSachPhieuNhapMuonHangModalComponent } from '@app/modules/kho-hang/modals/danh-sach-phieu-nhap-muon-hang-modal/danh-sach-phieu-nhap-muon-hang-modal.component';
import { ChiNhanh, DonViGiaCong, KhachHang, LenhVay, NhaCungCap, NhaCungCap_SoTaiKhoan, PhieuChi, PhieuChi_PhieuNhapKho } from '@app/shared/entities';
import {
    AppInfoService,
    CommonService,
    RouteInterceptorService,
    KhachHangService,
    NhaCungCapService,
    QuyTaiKhoanService,
    NoiDungThuChiService,
    PhieuChiService,
    LenhVayService,
    DonViGiaCongService,
    PhieuNhapMuonHangService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DanhSachLenhVayModalComponent } from '../../modals/danh-sach-lenh-vay/danh-sach-lenh-vay-modal.component';

@Component({
    selector: 'app-phieu-chi-them-moi',
    templateUrl: './phieu-chi-them-moi.component.html',
    styleUrls: ['./phieu-chi-them-moi.component.css']
})
export class PhieuChiThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuChi: DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieuchi: PhieuChi;
    public loaiphieuchi: string = null;

    public lstKhachHang: KhachHang[] = [];
    public lstNhaCungCap: NhaCungCap[] = [];
    public lstDonViGiaCong: DonViGiaCong[] = [];
    public lstSoTaiKhoan: NhaCungCap_SoTaiKhoan[] = [];

    public dataSource_LenhVay: DataSource;
    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_SoTaiKhoan: DataSource;

    public dataSource_QuyTaiKhoan: DataSource;
    public dataSource_NoiDungThuChi: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public isPhanBoTien: boolean = true;

    public phieunhapkhos: PhieuChi_PhieuNhapKho[] = [];

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

        private phieuchiService: PhieuChiService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private donvigiacongService: DonViGiaCongService,
        private quytaikhoanService: QuyTaiKhoanService,
        private noidungthuchiService: NoiDungThuChiService,
        private lenhvayService: LenhVayService,
        private phieunhapmuonhangService: PhieuNhapMuonHangService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuThu.instance.validate(); // showValidationSummary sau khi focus out
    }
    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieuchi = new PhieuChi();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.quytaikhoanService.findQuyTaiKhoans(x.id).subscribe((x) => {
                        this.dataSource_QuyTaiKhoan = new DataSource({
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
                this.lstKhachHang = x;
                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.lstNhaCungCap = x;
                this.dataSource_NhaCungCap = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                this.lstDonViGiaCong = x;
                this.dataSource_DonViGiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.noidungthuchiService.findNoiDungThuChis('chi').subscribe((x) => {
                this.dataSource_NoiDungThuChi = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCap_SoTaiKhoans().subscribe((x) => {
                this.dataSource_SoTaiKhoan = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        // kiểm tra có thuộc các loại phiếu thu này hay không?
        // loaiphieuthu=khac
        // loaiphieuthu=lenhvay
        // loaiphieuthu=khachhang
        // loaiphieuthu=nhacungcap
        // loaiphieuthu=donvigiacong

        let arrLoaiPhieuChi: string[] = ['khac', 'lenhvay', 'muonhang', 'khachhang', 'nhacungcap', 'donvigiacong'];

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.loaiphieuchi) && arrLoaiPhieuChi.includes(params.loaiphieuchi)) {
                    this.loaiphieuchi = params.loaiphieuchi;
                }

                // lay thong tin lenh vay
                if (params.loaiphieuchi == 'lenhvay' && this.commonService.isNotEmpty(params.tuphieu)) {
                    // lấy thông tin từ api
                    this.lenhvayService.findLenhVay(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            this.phieuchi.lenhvay_id = data.id;
                            this.phieuchi.sotienchi_lenhvay = data.sotienvay - data.sotiendachi;
                            this.phieuchi.sotienchi_laixuat = 0;
                        },
                        (error) => {
                            this.lenhvayService.handleError(error);
                        }
                    );
                }

                // lay thong tin muon hang
                if (params.loaiphieuchi == 'muonhang' && this.commonService.isNotEmpty(params.tuphieu)) {
                    // lấy thông tin từ api
                    this.phieunhapmuonhangService.findPhieuNhapMuonHang(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            this.phieuchi.phieunhapmuonhang_id = data.id;
                            this.phieuchi.nguoinhan_hoten = data.tenkhoxuat; // chi tiền kho cho mượn
                            this.phieuchi.sotienchi = data.tongthanhtien - data.sotiendachi;
                        },
                        (error) => {
                            this.phieunhapmuonhangService.handleError(error);
                        }
                    );
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin khách hàng
            let khachhang = this.lstKhachHang.find((x) => x.id == this.phieuchi.khachhang_id);
            this.phieuchi.nguoinhan_hoten = khachhang.tenkhachhang;
            this.phieuchi.nguoinhan_diachi = khachhang.diachi;
            this.phieuchi.nguoinhan_dienthoai = khachhang.sodienthoai;

            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieuchi.khachhang_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    this.onTinhNoConLai();
                })
            );

            // lấy danh sách phiếu xuất kho
            this.subscriptions.add(
                this.phieuchiService.findPhieuNhapKhos(this.currentChiNhanh.id, this.phieuchi.khachhang_id, this.phieuchi.nhacungcap_id).subscribe((data) => {
                    this.phieunhapkhos = data;
                })
            );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin nhà cung cấp
            let nhacungcap = this.lstNhaCungCap.find((x) => x.id == this.phieuchi.nhacungcap_id);
            this.phieuchi.nguoinhan_hoten = nhacungcap.tennhacungcap;
            this.phieuchi.nguoinhan_diachi = nhacungcap.diachi;
            this.phieuchi.nguoinhan_dienthoai = nhacungcap.sodienthoai;

            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieuchi.nhacungcap_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    this.onTinhNoConLai();
                })
            );

            // lấy danh sách phiếu nhập kho
            this.subscriptions.add(
                this.phieuchiService.findPhieuNhapKhos(this.currentChiNhanh.id, this.phieuchi.khachhang_id, this.phieuchi.nhacungcap_id).subscribe((data) => {
                    this.phieunhapkhos = data;
                })
            );

            // lấy danh sách số tài khoản
            this.subscriptions.add(
                this.nhacungcapService.findNhaCungCap_SoTaiKhoans(this.phieuchi.nhacungcap_id).subscribe((data) => {
                    this.dataSource_SoTaiKhoan = new DataSource({
                        store: data,
                        paginate: true,
                        pageSize: 50
                    });
                })
            );
        }

        if (e.dataField == 'donvigiacong_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin đơn vị gia công
            let donvigiacong = this.lstDonViGiaCong.find((x) => (x.id = this.phieuchi.donvigiacong_id));
            this.phieuchi.nguoinhan_hoten = donvigiacong.tendonvigiacong;
            this.phieuchi.nguoinhan_diachi = donvigiacong.diachi;
            this.phieuchi.nguoinhan_dienthoai = donvigiacong.sodienthoai;

            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.donViGiaCong_LoadNoCu(this.phieuchi.donvigiacong_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    this.onTinhNoConLai();
                })
            );
        }

        if (e.dataField == 'sotienchi' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();

            // phân bổ tiền
            if (this.isPhanBoTien) {
                let sotienchiphieu = this.phieuchi.sotienchi;

                this.phieunhapkhos.forEach((v, i) => {
                    if (sotienchiphieu > 0) {
                        let tiencanchi = v.tongthanhtien - v.sotienchitruoc;
                        if (sotienchiphieu > tiencanchi) {
                            v.sotienchi = tiencanchi;
                        }
                        if (sotienchiphieu <= tiencanchi) {
                            v.sotienchi = sotienchiphieu;
                        }
                        sotienchiphieu -= v.sotienchi;
                    } else v.sotienchi = 0;
                });
            }
        }

        if (e.dataField == 'sotiengiam' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();

            // phân bổ tiền
            if (this.isPhanBoTien) {
                let sotiengiamphieu = this.phieuchi.sotiengiam;

                this.phieunhapkhos.forEach((v, i) => {
                    if (sotiengiamphieu > 0) {
                        let sotiencanchi = v.tongthanhtien - v.sotienchitruoc - v.sotienchi;
                        if (sotiengiamphieu > sotiencanchi) {
                            v.sotiengiam = sotiencanchi;
                        }
                        if (sotiengiamphieu > 0 && sotiengiamphieu <= sotiencanchi) {
                            v.sotiengiam = sotiengiamphieu;
                        }
                        sotiengiamphieu -= v.sotiengiam;
                    } else v.sotiengiam = 0;
                });
            }
        }

        if (e.dataField == 'sotienchi_lenhvay' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();
        }
        if (e.dataField == 'sotienchi_laixuat' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        this.isPhanBoTien = false;

        let tongchi = 0;
        let tonggiam = 0;
        this.phieunhapkhos.forEach((v, i) => {
            tongchi += v.sotienchi;
            tonggiam += v.sotiengiam;
        });
        this.phieuchi.sotienchi = tongchi;
        this.phieuchi.sotiengiam = tonggiam;

        // tính tiền
        this.onTinhNoConLai();

        // đặt time out 1s tránh được nó tự phân bổ, js bất đồng bộ -> mệt mỏi
        setTimeout(() => {
            this.isPhanBoTien = true;
        }, 1000);
    }

    private onTinhNoConLai() {
        this.phieuchi.tongchi = this.phieuchi.sotienchi + this.phieuchi.sotiengiam;

        switch (this.loaiphieuchi) {
            case 'khac':
                this.phieuchi.nocu = null;
                this.phieuchi.conno = null;
                return;
                break;
            case 'lenhvay':
                this.phieuchi.tongchi = this.phieuchi.sotienchi_lenhvay + this.phieuchi.sotienchi_laixuat;
                this.phieuchi.nocu = null;
                this.phieuchi.conno = null;
                return;
                break;
            case 'khachhang':
                this.phieuchi.conno = this.phieuchi.nocu + this.phieuchi.tongchi;
                break;
            case 'nhacungcap':
                this.phieuchi.conno = this.phieuchi.nocu - this.phieuchi.tongchi;
                break;
            case 'donvigiacong':
                this.phieuchi.conno = this.phieuchi.nocu - this.phieuchi.tongchi;
                break;
        }

        // ? nhà cung cấp, có phiếu xuất hoặc không -> tính số tiền chi dư
        if (this.loaiphieuchi == 'nhacungcap') {
            let sotienchidu: number = 0;
            let tongchi_chitiet: number = 0;

            sotienchidu = this.phieuchi.tongchi;
            this.phieunhapkhos.forEach((x) => {
                tongchi_chitiet += x.sotienchi + x.sotiengiam;
            });
            sotienchidu = this.phieuchi.tongchi - tongchi_chitiet;
            this.phieuchi.sotienchi_du = sotienchidu >= 0 ? sotienchidu : 0;
        }
    }

    openModal(tuphieu: string) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: tuphieu == 'lenhvay' ? 'DANH SÁCH LỆNH VAY' : 'DANH SÁCH PHIẾU NHẬP MƯỢN' // và nhiều hơn thế nữa
        };

        /* hiển thị modal */
        if (tuphieu == 'lenhvay')
            this.bsModalRef = this.modalService.show(DanhSachLenhVayModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        else this.bsModalRef = this.modalService.show(DanhSachPhieuNhapMuonHangModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-chi/them-moi`], { queryParams: { loaiphieuchi: this.loaiphieuchi, tuphieu: result.id } });
        });
    }

    /* xác thực dữ liệu trước khi gửi đi */
    onValidate() {
        let valid = true;
        if (this.loaiphieuchi == 'lenhvay' && this.phieuchi.lenhvay_id == null) valid = false;
        if (this.loaiphieuchi == 'muonhang' && this.phieuchi.phieunhapmuonhang_id == null) valid = false;
        if (!valid)
            notify(
                {
                    width: 320,
                    message: 'Vui lòng chọn phiếu để chi',
                    position: { my: 'right top', at: 'right top' }
                },
                'warning',
                475
            );
        return valid;
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuChi.instance.validate().isValid) return;
        if (!this.onValidate()) return;

        // bỏ qua các dòng dữ liệu số tiền thu = 0 và số tiền giảm = 0
        let phieuchi_phieunhapkhos = this.phieunhapkhos.filter((x) => x.sotienchi != 0 || x.sotiengiam != 0);
        let phieuchi_req = this.phieuchi;

        // gán lại dữ liệu
        phieuchi_req.chinhanh_id = this.currentChiNhanh.id;
        phieuchi_req.loaiphieuchi = this.loaiphieuchi;
        phieuchi_req.phieuchi_phieunhapkhos = phieuchi_phieunhapkhos;

        if (phieuchi_req.loaiphieuchi == 'lenhvay') {
            phieuchi_req.sotienchi = this.phieuchi.sotienchi_lenhvay + this.phieuchi.sotienchi_laixuat;
        }
        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuchiService.addPhieuChi(phieuchi_req).subscribe(
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
                    this.router.navigate(['/phieu-chi']);
                    this.frmPhieuChi.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuchiService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
