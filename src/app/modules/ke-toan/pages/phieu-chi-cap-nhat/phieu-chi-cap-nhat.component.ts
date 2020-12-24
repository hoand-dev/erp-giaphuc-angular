import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, PhieuChi, KhachHang, NhaCungCap, PhieuChi_PhieuNhapKho } from '@app/shared/entities';
import { AppInfoService, CommonService, RouteInterceptorService, PhieuChiService, KhachHangService, NhaCungCapService, QuyTaiKhoanService, NoiDungThuChiService } from '@app/shared/services';
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

    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_QuyTaiKhoan: DataSource;
    public dataSource_NoiDungThuChi: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public isLoadLanDau: boolean = false;
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
            this.quytaikhoanService.findQuyTaiKhoans().subscribe((x) => {
                this.dataSource_QuyTaiKhoan = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.noidungthuchiService.findNoiDungThuChis().subscribe((x) => {
                this.dataSource_NoiDungThuChi = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieuchi_id = params.id;
                // lấy thông tin
                if (phieuchi_id) {
                    this.subscriptions.add(
                        this.phieuchiService.findPhieuChi(phieuchi_id).subscribe(
                            (data) => {
                                // this.isPhanBoTien = false;
                                this.isLoadLanDau = true;
                                this.loaiphieuchi = data.loaiphieuchi;
                                this.phieuchi = data;
                                this.phieuchi.phieuchi_phieunhapkhos_old = this.phieuchi.phieuchi_phieunhapkhos;
                                this.phieunhapkhos = this.phieuchi.phieuchi_phieunhapkhos;

                                // setTimeout(() => {
                                //     this.isPhanBoTien = true;
                                // }, 1000);
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
        }

        // ? thu khách hàng, nhà cung cấp có phiếu xuất hoặc không -> tính số tiền thu dư
        // if (this.loaiphieuchi == 'khac') return; // thu khác không làm gì nữa
        let sotienchidu: number = 0;
        let tongchi_chitiet: number = 0;

        sotienchidu = this.phieuchi.tongchi;
        this.phieunhapkhos.forEach((x) => {
            tongchi_chitiet += x.sotienchi + x.sotiengiam;
        });
        sotienchidu = this.phieuchi.tongchi - tongchi_chitiet;
        this.phieuchi.sotienchi_du = sotienchidu >= 0 ? sotienchidu : 0;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu số tiền thu = 0 và số tiền giảm = 0
        let phieuchi_phieunhapkhos = this.phieunhapkhos.filter((x) => x.sotienchi != 0 || x.sotiengiam != 0);
        let phieuchi_req = this.phieuchi;

        // gán lại dữ liệu
        phieuchi_req.chinhanh_id = this.currentChiNhanh.id;
        phieuchi_req.loaiphieuchi = this.loaiphieuchi;
        phieuchi_req.phieuchi_phieunhapkhos = phieuchi_phieunhapkhos;

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
