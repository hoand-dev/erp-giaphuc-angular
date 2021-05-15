import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, PhieuDatHang, KhachHang, NguoiDung, KhoHang, PhieuDatHang_ChiTiet, DinhMuc, HangHoa, PhieuDatHang_SanXuatChiTiet, SoMat, PhieuDatHang_ThanhPham } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    PhieuDatHangService,
    KhachHangService,
    HangHoaService,
    NguoiDungService,
    KhoHangService,
    CommonService,
    DinhMucService,
    SoMatService,
    RouteInterceptorService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-khach-dat-hang-view-modal',
    templateUrl: './phieu-khach-dat-hang-view-modal.component.html',
    styleUrls: ['./phieu-khach-dat-hang-view-modal.component.css']
})
export class PhieuKhachDatHangViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;
    private currentChiNhanh: ChiNhanh;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieudathang_id: number;

    /* thông tin copy */
    /* tối ưu subscriptions */
    public phieudathang: PhieuDatHang;

    public lstKhachHang: KhachHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];
    public lstKhoHang: KhoHang[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_NguoiDung: DataSource;
    public dataSource_KhoHang: DataSource;

    public fisrtLoad_KhachHang = true;

    // trạng thái process
    public saveProcessing = false;
    public loadingVisible = true;

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // tất toán
    public isTatToan: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    private sxhanghoalenght: number = 0;
    private sxhanghoalenght_yeucau: number = 0;
    private sxhanghoalenght_somat: number = 0;
    private sxhanghoalenght_somat_thanhpham: number = 0;

    public lstHangHoa: HangHoa[];
    public lstGiaCong: DinhMuc[];
    public lstSoMat: SoMat[];

    public hanghoas: PhieuDatHang_ChiTiet[] = [];
    public hanghoas_sanxuat: PhieuDatHang_SanXuatChiTiet[] = [];
    public hanghoas_thanhpham: PhieuDatHang_ThanhPham[] = [];

    public dataSource_HangHoa: DataSource;
    public dataSource_HangHoaSX: DataSource;
    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;

    constructor(
        public sumTotal: SumTotalPipe,
        public appInfoService: AppInfoService,
        private routeInterceptorService: RouteInterceptorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private phieudathangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private nguoidungService: NguoiDungService,
        private khohangService: KhoHangService,
        private authenticationService: AuthenticationService,

        private hanghoaService: HangHoaService,
        private giacongService: DinhMucService,
        private somatService: SoMatService,
        private commonService: CommonService,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        /*thêm nội dung vào đây */

        this.phieudathang = new PhieuDatHang();

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

        this.subscriptions.add(
            this.giacongService.findDinhMucs().subscribe((x) => {
                this.lstGiaCong = x;
                this.dataSource_GiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.somatService.findSoMats().subscribe((x) => {
                this.lstSoMat = x;
                this.dataSource_SoMat = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.dataSource_HangHoa = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieudathang.khoxuat_id, null, loadOptions)
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
        this.dataSource_HangHoaSX = this.dataSource_HangHoa;

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieudathangService.findPhieuDatHang(this.phieudathang_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieudathang_chitiet.length;

                        this.sxhanghoalenght = data.phieudathang_sanxuatchitiets.length;
                        this.sxhanghoalenght_yeucau = data.phieudathang_sanxuatchitiets.length;
                        this.sxhanghoalenght_somat = data.phieudathang_sanxuatchitiets.length;
                        this.sxhanghoalenght_somat_thanhpham = data.phieudathang_sanxuatchitiets.length;

                        this.phieudathang = data;
                        this.hanghoas = this.phieudathang.phieudathang_chitiet;
                        this.hanghoas_sanxuat = this.phieudathang.phieudathang_sanxuatchitiets;
                        this.hanghoas_thanhpham = this.phieudathang.phieudathang_thanhphams;
                    },
                    (error) => {
                        this.phieudathangService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            // xem lịch sử xử lý sau
        }
        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tattoan)) {
                    this.isTatToan = true;
                }
            })
        );
    }

    dataSourceReload(index) {
        this.dataSource_HangHoaSX = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.hanghoas_sanxuat[index].khoxuat_id, 'hangtron,thanhpham', loadOptions)
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
    }

    onYeuCauChanged(index, e) {
        if (this.sxhanghoalenght_yeucau > 0) {
            this.sxhanghoalenght_yeucau--;
        } else this.onTaoThanhPham(index);
    }

    onSoMatYeuCauChanged(index, e) {
        let selected = e.selectedItem;
        if (this.sxhanghoalenght_somat > 0) {
            this.sxhanghoalenght_somat--;
        } else {
            // gán số mặt cho thành phẩm
            this.hanghoas_sanxuat[index].somat_thanhpham_id = selected.id;

            // gán giá trị hệ số
            // this.hanghoas_sanxuat[index].heso = selected.giatri;
        }
    }

    onSoMatThanhPhamChanged(index, e) {
        let selected = e.selectedItem;
        if (this.sxhanghoalenght_somat_thanhpham > 0) {
            this.sxhanghoalenght_somat_thanhpham--;
        } else {
            /* tạo lại mã mới cho thành phẩm */
            this.onTaoThanhPham(index);
        }
    }

    onTaoThanhPham(index) {
        if (this.hanghoas_sanxuat[index].hanghoa_id != null) {
            let somat = this.lstSoMat.find((x) => x.id == this.hanghoas_sanxuat[index].somat_thanhpham_id);
            let masomat: string = somat != null ? somat.masomat.toString().trim() : '';
            let tensomat: string = somat != null ? somat.tensomat.toString().trim() : '';

            let _: string = ' ';

            this.subscriptions.add(
                this.hanghoaService.findHangHoa(this.hanghoas_sanxuat[index].hanghoa_id).subscribe((x) => {
                    let hanghoa: HangHoa = x;
                    if (hanghoa != undefined) {
                        let idgiacongs_thanhpham: number[] = JSON.parse(hanghoa.idgiacongs);

                        let magiacong: string = '';
                        let tengiacong: string = '';
                        if (this.hanghoas_sanxuat[index].arr_yeucaus != null) {
                            this.hanghoas_sanxuat[index].arr_yeucaus.forEach((value, index) => {
                                let giacong = this.lstGiaCong.find((x) => x.id == value);
                                if (typeof giacong === 'object') {
                                    if (hanghoa.loaihanghoa == 'thanhpham' && idgiacongs_thanhpham !== null && !idgiacongs_thanhpham.includes(value)) {
                                        magiacong += giacong.madinhmuc;
                                        tengiacong += giacong.tendinhmuc + ' ';
                                    }
                                    if (hanghoa.loaihanghoa != 'thanhpham') {
                                        magiacong += giacong.madinhmuc;
                                        tengiacong += giacong.tendinhmuc + ' ';
                                    }
                                }
                            });
                            tengiacong = tengiacong.trim();
                        }

                        if (hanghoa.loaihanghoa == 'thanhpham') {
                            magiacong = magiacong + hanghoa.magiacong;
                            tengiacong = tengiacong + _ + hanghoa.tengiacong;
                        }

                        let mahanghoa: string = magiacong + masomat + hanghoa.matieuchuan + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + hanghoa.ncc + hanghoa.maloaihang;
                        let tenhanghoa: string =
                            tengiacong + _ + tensomat + _ + hanghoa.tentieuchuan + _ + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + _ + hanghoa.ncc + _ + hanghoa.tenloaihang;

                        this.hanghoas_sanxuat[index].mathanhpham = mahanghoa.split('null').join('').trim();
                        this.hanghoas_sanxuat[index].tenthanhpham = tenhanghoa.split('null').join('').trim();

                        if (this.hanghoas_sanxuat[index].arr_yeucaus.length > 0) this.hanghoas_sanxuat[index].yeucaus = this.hanghoas_sanxuat[index].arr_yeucaus.toString();
                    }
                })
            );
        }
    }

    public onHangHoaChanged(index, e, tabName: string = 'hangcosan') {
        let selected = e.selectedItem;

        if (tabName == 'hangcosan') {
            // xử lý lại thông tin dựa trên lựa chọn
            if (this.hanghoalenght > 0) {
                this.hanghoalenght--;
            } else {
                this.hanghoas[index].khoxuat_id = this.phieudathang.khoxuat_id;
                this.hanghoas[index].dvt_id = selected.dvt_id;
                this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

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
        }
        if (tabName == 'sanxuat') {
            if (this.sxhanghoalenght > 0) {
                this.sxhanghoalenght--;
                this.hanghoas_sanxuat[index].arr_yeucaus = JSON.parse(this.hanghoas_sanxuat[index].yeucaus);
                this.sxhanghoalenght_yeucau = this.hanghoas_sanxuat[index].arr_yeucaus.length;
                this.hanghoas_sanxuat[index].yeucaus = this.hanghoas_sanxuat[index].arr_yeucaus.toString();
            } else {
                this.hanghoas_sanxuat[index].dvt_id = selected.dvt_id;
            }

            this.hanghoas_sanxuat[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas_sanxuat[index].tilequydoiphu = selected.quydoi1;
            this.hanghoas_sanxuat[index].trongluong = selected.trongluong;
            this.hanghoas_sanxuat[index].m3 = selected.m3;
            this.hanghoas_sanxuat[index].tendonvitinh = selected.tendonvitinh;
            this.hanghoas_sanxuat[index].tendonvitinhphu = selected.tendonvitinhphu;

            this.onTaoThanhPham(index);

            // chỉ thêm row mới khi không tồn tài dòng rỗng nào
            let rowsNull = this.hanghoas_sanxuat.filter((x) => x.hanghoa_id == null);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onConfirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
