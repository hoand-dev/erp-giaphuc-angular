import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhachHang, NhaCungCap, PhieuChi, PhieuChi_PhieuNhapKho } from '@app/shared/entities';
import { AppInfoService, CommonService, RouteInterceptorService, KhachHangService, NhaCungCapService, QuyTaiKhoanService, NoiDungThuChiService, PhieuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-phieu-chi-them-moi',
  templateUrl: './phieu-chi-them-moi.component.html',
  styleUrls: ['./phieu-chi-them-moi.component.css']
})
export class PhieuChiThemMoiComponent implements OnInit {

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

        // kiểm tra có thuộc các loại phiếu thu này hay không?
        // loaiphieuthu=khac
        // loaiphieuthu=khachhang
        // loaiphieuthu=nhacungcap
        // loaiphieuthu=khogiacong
        // loaiphieuthu=donvigiacong

        let arrLoaiPhieuChi: string [] = [
            'khac', 'khachhang', 'nhacungcap', 'khogiacong', 'donvigiacong'
        ];

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.loaiphieuchi) && arrLoaiPhieuChi.includes(params.loaiphieuthu)) {
                    this.loaiphieuchi = params.loaiphieuchi;
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
                this.commonService.khachHang_LoadNoCu(this.phieuchi.khachhang_id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                })
            );

            // tính tiền
            this.onTinhNoConLai();

            // lấy danh sách phiếu xuất kho
            this.subscriptions.add(
                this.phieuchiService.findPhieuNhapKhos(this.currentChiNhanh.id, this.phieuchi.khachhang_id, this.phieuchi.nhacungcap_id).subscribe((data) => {
                    this.phieunhapkhos = data;
                })
            );
        }
        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin khách hàng
            let nhacungcap = this.lstNhaCungCap.find((x) => x.id == this.phieuchi.nhacungcap_id);
            this.phieuchi.nguoinhan_hoten = nhacungcap.tennhacungcap;
            this.phieuchi.nguoinhan_diachi = nhacungcap.diachi;
            this.phieuchi.nguoinhan_dienthoai = nhacungcap.sodienthoai;

            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieuchi.nhacungcap_id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                })
            );

            // tính tiền
            this.onTinhNoConLai();

            // lấy danh sách phiếu xuất kho
            this.subscriptions.add(
                this.phieuchiService.findPhieuNhapKhos(this.currentChiNhanh.id, this.phieuchi.khachhang_id, this.phieuchi.nhacungcap_id).subscribe((data) => {
                    this.phieunhapkhos = data;
                })
            );
        }

        if (e.dataField == 'sotienthu' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();

            // phân bổ tiền
            if (this.isPhanBoTien) {
                let sotienchiphieu = this.phieuchi.sotienchi;

                this.phieunhapkhos.forEach((v, i) => {
                    if (sotienchiphieu > 0) {
                        let tiencanthu = v.tongthanhtien - v.sotienchitruoc;
                        if (sotienchiphieu > tiencanthu) {
                            v.sotienchi = tiencanthu;
                        }
                        if (sotienchiphieu <= tiencanthu) {
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

        // ? nếu thu khác còn nợ = 0
        this.phieuchi.conno = this.loaiphieuchi == "khac" ? 0 : this.phieuchi.nocu - this.phieuchi.tongchi;

        // ? thu khách hàng, nhà cung cấp có phiếu xuất hoặc không -> tính số tiền thu dư
        if(this.loaiphieuchi == "khac") return; // thu khác không làm gì nữa
        let sotienchidu: number = 0;
        let tongchi_chitiet: number = 0;

        sotienchidu = this.phieuchi.tongchi;
        this.phieunhapkhos.forEach((x) => {
            tongchi_chitiet += x.sotienchi + x.sotiengiam;
        });
        sotienchidu = this.phieuchi.tongchi - tongchi_chitiet;
        this.phieuchi.sotienchi = sotienchidu >= 0 ? sotienchidu : 0;
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
                    this.router.navigate(['/phieu-thu']);
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