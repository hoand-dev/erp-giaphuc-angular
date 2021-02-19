import { ChiNhanh, NhaCungCap, PhieuThu, PhieuThu_PhieuXuatKho } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, KhachHangService, NhaCungCapService, NoiDungThuChiService, PhieuThuService, PhieuXuatMuonHangService, QuyTaiKhoanService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhachHang } from '@app/shared/entities';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DanhSachPhieuXuatMuonHangModalComponent } from '@app/modules/kho-hang/modals/danh-sach-phieu-xuat-muon-hang-modal/danh-sach-phieu-xuat-muon-hang-modal.component';

@Component({
    selector: 'app-phieu-thu-them-moi',
    templateUrl: './phieu-thu-them-moi.component.html',
    styleUrls: ['./phieu-thu-them-moi.component.css']
})
export class PhieuThuThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuThu: DxFormComponent;
    bsModalRef: BsModalRef;
    
    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public phieuthu: PhieuThu;
    public loaiphieuthu: string = null;

    public lstKhachHang: KhachHang[] = [];
    public lstNhaCungCap: NhaCungCap[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_QuyTaiKhoan: DataSource;
    public dataSource_NoiDungThuChi: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public isPhanBoTien: boolean = true;

    public phieuxuatkhos: PhieuThu_PhieuXuatKho[] = [];

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

        private phieuthuService: PhieuThuService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private quytaikhoanService: QuyTaiKhoanService,
        private noidungthuchiService: NoiDungThuChiService,
        private phieuxuatmuonhangService: PhieuXuatMuonHangService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuThu.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieuthu = new PhieuThu();

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
            this.noidungthuchiService.findNoiDungThuChis('thu').subscribe((x) => {
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

        let arrLoaiPhieuThu: string[] = ['khac', 'muonhang', 'khachhang', 'nhacungcap', 'donvigiacong'];

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.loaiphieuthu) && arrLoaiPhieuThu.includes(params.loaiphieuthu)) {
                    this.loaiphieuthu = params.loaiphieuthu;
                }

                // lay thong tin muon hang
                if (params.loaiphieuthu == 'muonhang' && this.commonService.isNotEmpty(params.tuphieu)) {
                    // lấy thông tin từ api
                    this.phieuxuatmuonhangService.findPhieuXuatMuonHang(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            this.phieuthu.phieuxuatmuonhang_id = data.id;
                            this.phieuthu.nguoinop_hoten = data.tenkhonhap; // chi tiền kho cho mượn
                            this.phieuthu.sotienthu = data.tongthanhtien - data.sotiendathu;
                        },
                        (error) => {
                            this.phieuxuatmuonhangService.handleError(error);
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

    openModal(tuphieu: string) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH PHIẾU XUẤT MƯỢN'
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuXuatMuonHangModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-thu/them-moi`], { queryParams: { loaiphieuthu: this.loaiphieuthu, tuphieu: result.id } });
        });
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin khách hàng
            let khachhang = this.lstKhachHang.find((x) => x.id == this.phieuthu.khachhang_id);
            this.phieuthu.nguoinop_hoten = khachhang.tenkhachhang;
            this.phieuthu.nguoinop_diachi = khachhang.diachi;
            this.phieuthu.nguoinop_dienthoai = khachhang.sodienthoai;

            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieuthu.khachhang_id, this.currentChiNhanh.id, this.phieuthu.sort).subscribe((data) => {
                    this.phieuthu.nocu = data;
                    this.onTinhNoConLai();
                })
            );

            // lấy danh sách phiếu xuất kho
            this.subscriptions.add(
                this.phieuthuService.findPhieuXuatKhos(this.currentChiNhanh.id, this.phieuthu.khachhang_id, this.phieuthu.nhacungcap_id).subscribe((data) => {
                    this.phieuxuatkhos = data;
                })
            );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy thông tin khách hàng
            let nhacungcap = this.lstNhaCungCap.find((x) => x.id == this.phieuthu.nhacungcap_id);
            this.phieuthu.nguoinop_hoten = nhacungcap.tennhacungcap;
            this.phieuthu.nguoinop_diachi = nhacungcap.diachi;
            this.phieuthu.nguoinop_dienthoai = nhacungcap.sodienthoai;

            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieuthu.nhacungcap_id, this.currentChiNhanh.id, this.phieuthu.sort).subscribe((data) => {
                    this.phieuthu.nocu = data;
                    this.onTinhNoConLai();
                })
            );

            // lấy danh sách phiếu xuất kho
            this.subscriptions.add(
                this.phieuthuService.findPhieuXuatKhos(this.currentChiNhanh.id, this.phieuthu.khachhang_id, this.phieuthu.nhacungcap_id).subscribe((data) => {
                    this.phieuxuatkhos = data;
                })
            );
        }

        if (e.dataField == 'sotienthu' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();

            // phân bổ tiền
            if (this.isPhanBoTien) {
                let sotienthuphieu = this.phieuthu.sotienthu;

                this.phieuxuatkhos.forEach((v, i) => {
                    if (sotienthuphieu > 0) {
                        let tiencanthu = v.tongthanhtien - v.sotienthutruoc;
                        if (sotienthuphieu > tiencanthu) {
                            v.sotienthu = tiencanthu;
                        }
                        if (sotienthuphieu <= tiencanthu) {
                            v.sotienthu = sotienthuphieu;
                        }
                        sotienthuphieu -= v.sotienthu;
                    } else v.sotienthu = 0;
                });
            }
        }

        if (e.dataField == 'sotiengiam' && e.value !== undefined && e.value !== null) {
            this.onTinhNoConLai();

            // phân bổ tiền
            if (this.isPhanBoTien) {
                let sotiengiamphieu = this.phieuthu.sotiengiam;

                this.phieuxuatkhos.forEach((v, i) => {
                    if (sotiengiamphieu > 0) {
                        let tiencanthu = v.tongthanhtien - v.sotienthutruoc - v.sotienthu;
                        if (sotiengiamphieu > tiencanthu) {
                            v.sotiengiam = tiencanthu;
                        }
                        if (sotiengiamphieu > 0 && sotiengiamphieu <= tiencanthu) {
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

        let tongthu = 0;
        let tonggiam = 0;
        this.phieuxuatkhos.forEach((v, i) => {
            tongthu += v.sotienthu;
            tonggiam += v.sotiengiam;
        });
        this.phieuthu.sotienthu = tongthu;
        this.phieuthu.sotiengiam = tonggiam;

        // tính tiền
        this.onTinhNoConLai();

        // đặt time out 1s tránh được nó tự phân bổ, js bất đồng bộ -> mệt mỏi
        setTimeout(() => {
            this.isPhanBoTien = true;
        }, 1000);
    }

    private onTinhNoConLai() {
        this.phieuthu.tongthu = this.phieuthu.sotienthu + this.phieuthu.sotiengiam;
        switch (this.loaiphieuthu) {
            case 'khac':
                // ? nếu thu khác còn nợ = 0
                this.phieuthu.conno = 0;
                return;
                break;
            case 'khachhang':
                this.phieuthu.conno = this.phieuthu.nocu - this.phieuthu.tongthu;
                break;
            case 'nhacungcap':
                this.phieuthu.conno = this.phieuthu.nocu + this.phieuthu.tongthu;
                break;
        }

        // ? khách hàng, có phiếu xuất hoặc không -> tính số tiền thu dư
        if (this.loaiphieuthu == 'khachhang') {
            let sotienthudu: number = 0;
            let tongthu_chitiet: number = 0;

            sotienthudu = this.phieuthu.tongthu;
            this.phieuxuatkhos.forEach((x) => {
                tongthu_chitiet += x.sotienthu + x.sotiengiam;
            });
            sotienthudu = this.phieuthu.tongthu - tongthu_chitiet;
            this.phieuthu.sotienthu_du = sotienthudu >= 0 ? sotienthudu : 0;
        }
    }

    /* xác thực dữ liệu trước khi gửi đi */
    onValidate(){
        let valid = true;
        if(this.loaiphieuthu == 'muonhang' && this.phieuthu.phieuxuatmuonhang_id == null)
            valid = false;
        if(!valid)
            notify(
                {
                    width: 320,
                    message: 'Vui lòng chọn phiếu để thu',
                    position: { my: 'right top', at: 'right top' }
                },
                'warning',
                475
            );
        return valid;
    }

    public onSubmitForm(e) {
        if(!this.onValidate()) return;

        // bỏ qua các dòng dữ liệu số tiền thu = 0 và số tiền giảm = 0
        let phieuthu_phieuxuatkhos = this.phieuxuatkhos.filter((x) => x.sotienthu != 0 || x.sotiengiam != 0);
        let phieuthu_req = this.phieuthu;

        // gán lại dữ liệu
        phieuthu_req.chinhanh_id = this.currentChiNhanh.id;
        phieuthu_req.loaiphieuthu = this.loaiphieuthu;
        phieuthu_req.phieuthu_phieuxuatkhos = phieuthu_phieuxuatkhos;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuthuService.addPhieuThu(phieuthu_req).subscribe(
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
                    this.frmPhieuThu.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuthuService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
