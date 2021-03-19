import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, PhieuChi, KhachHang, NhaCungCap, PhieuChi_PhieuNhapKho, DonViGiaCong, NhaCungCap_SoTaiKhoan } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    CommonService,
    RouteInterceptorService,
    PhieuChiService,
    KhachHangService,
    NhaCungCapService,
    QuyTaiKhoanService,
    NoiDungThuChiService,
    DonViGiaCongService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-chi-cap-nhat',
    templateUrl: './phieu-chi-cap-nhat.component.html',
    styleUrls: ['./phieu-chi-cap-nhat.component.css']
})
export class PhieuChiCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuChi: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public phieuchi: PhieuChi;
    public loaiphieuchi: string = null;

    public lstKhachHang: KhachHang[] = [];
    public lstNhaCungCap: NhaCungCap[] = [];
    public lstDonViGiaCong: DonViGiaCong[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_QuyTaiKhoan: DataSource;
    public dataSource_NoiDungThuChi: DataSource;
    public lstSoTaiKhoan: NhaCungCap_SoTaiKhoan[] = [];

    public saveProcessing = false;
    public loadingVisible = true;

    public isLoadLanDau: boolean = false;

    public phieunhapkhos: PhieuChi_PhieuNhapKho[] = [];
    public dataSource_SoTaiKhoan: DataSource;

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

        private phieuchiService: PhieuChiService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private donvigiacongService: DonViGiaCongService,
        private quytaikhoanService: QuyTaiKhoanService,
        private noidungthuchiService: NoiDungThuChiService
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
        // this.subscriptions.add(
        //     this.nhacungcapService.findNhaCungCap_SoTaiKhoans().subscribe((x) => {
        //         this.dataSource_SoTaiKhoan = new DataSource({
        //             store: x,
        //             paginate: true,
        //             pageSize: 50
        //         });
        //     })
        // );

        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieuchi_id = params.id;
                // lấy thông tin
                if (phieuchi_id) {
                    this.subscriptions.add(
                        this.phieuchiService.findPhieuChi(phieuchi_id).subscribe(
                            (data) => {
                                this.isLoadLanDau = true;
                                this.loaiphieuchi = data.loaiphieuchi;
                                this.phieuchi = data;
                                if(this.phieuchi.loaiphieuchi == 'lenhvay'){
                                    // trước khi lưu sẽ tính lại
                                    this.phieuchi.sotienchi = 0;
                                }
                                this.phieuchi.phieuchi_phieunhapkhos_old = this.phieuchi.phieuchi_phieunhapkhos;
                                this.phieunhapkhos = this.phieuchi.phieuchi_phieunhapkhos;
                            },
                            (error) => {
                                this.phieuchiService.handleError(error);
                            }
                        )
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
            if (!this.isLoadLanDau) {
                let khachhang = this.lstKhachHang.find((x) => x.id == this.phieuchi.khachhang_id);
                this.phieuchi.nguoinhan_hoten = khachhang.tenkhachhang;
                this.phieuchi.nguoinhan_diachi = khachhang.diachi;
                this.phieuchi.nguoinhan_dienthoai = khachhang.sodienthoai;
            }
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieuchi.khachhang_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    this.onTinhNoConLai();
                })
            );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin nhà cung cấp
            if (!this.isLoadLanDau) {
                let nhacungcap = this.lstNhaCungCap.find((x) => x.id == this.phieuchi.nhacungcap_id);
                this.phieuchi.nguoinhan_hoten = nhacungcap.tennhacungcap;
                this.phieuchi.nguoinhan_diachi = nhacungcap.diachi;
                this.phieuchi.nguoinhan_dienthoai = nhacungcap.sodienthoai;
            }
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieuchi.nhacungcap_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    this.onTinhNoConLai();
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
            if (!this.isLoadLanDau) {
                let donvigiacong = this.lstDonViGiaCong.find((x) => (x.id = this.phieuchi.donvigiacong_id));
                this.phieuchi.nguoinhan_hoten = donvigiacong.tendonvigiacong;
                this.phieuchi.nguoinhan_diachi = donvigiacong.diachi;
                this.phieuchi.nguoinhan_dienthoai = donvigiacong.sodienthoai;
            }
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.donViGiaCong_LoadNoCu(this.phieuchi.donvigiacong_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    this.onTinhNoConLai();
                })
            );
        }

        if (e.dataField == 'sotienchi_lenhvay' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();
        }
        if (e.dataField == 'sotienchi_laixuat' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();
        }
    }

    onChangeTienChi(e) {
        if (e.event) {
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
        this.onTinhNoConLai();
    }

    onChangeTienGiam(e) {
        if (e.event) {
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
        this.onTinhNoConLai();
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        if (e.event) {
            let tongchi = 0;
            let tonggiam = 0;
            this.phieunhapkhos.forEach((v, i) => {
                tongchi += v.sotienchi;
                tonggiam += v.sotiengiam;
            });
            this.phieuchi.sotienchi = tongchi;
            this.phieuchi.sotiengiam = tonggiam;
        }

        // tính tiền
        this.onTinhNoConLai();
    }

    calculateNoConLai() {
        switch (this.loaiphieuchi) {
            case 'khac':
                this.phieuchi.nocu = null;
                return null;
                break;
            case 'lenhvay':
                this.phieuchi.nocu = null;
                return null;
                break;
            case 'muonhang':
                this.phieuchi.nocu = null;
                return null;
                break;
            case 'khachhang':
                return this.phieuchi.nocu + this.phieuchi.tongchi;
                break;
            case 'nhacungcap':
                return this.phieuchi.nocu - this.phieuchi.tongchi;
                break;
            case 'donvigiacong':
                return this.phieuchi.nocu - this.phieuchi.tongchi;
                break;
            default:
                return null;
        }
    }

    private onTinhNoConLai() {
        // ? nhà cung cấp, có phiếu xuất hoặc không -> tính số tiền chi dư
        if (this.loaiphieuchi == 'nhacungcap') {
            let sotienchidu: number = 0;
            let tongchi_chitiet: number = 0;

            sotienchidu = this.phieuchi.tongchi;
            this.phieunhapkhos.forEach((x) => {
                x.sotienconlai = x.tongthanhtien - x.sotienchitruoc;
                tongchi_chitiet += x.sotienchi + x.sotiengiam;
            });
            sotienchidu = this.phieuchi.tongchi - tongchi_chitiet;
            this.phieuchi.sotienchi_du = sotienchidu >= 0 ? sotienchidu : 0;
        }
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuChi.instance.validate().isValid) return;

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
            this.phieuchiService.updatePhieuChi(phieuchi_req).subscribe(
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
