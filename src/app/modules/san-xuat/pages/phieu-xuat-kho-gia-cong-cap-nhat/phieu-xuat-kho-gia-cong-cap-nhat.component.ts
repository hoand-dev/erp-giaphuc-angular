import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DonViGiaCong, KhachHang, KhoHang, PhieuXuatKhoGiaCong, PhieuXuatKhoGiaCong_ChiTiet } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import {
    AppInfoService,
    CommonService,
    DanhSachXeService,
    DonViGiaCongService,
    HangHoaService,
    KhachHangService,
    KhoHangService,
    PhieuXuatKhoGiaCongService,
    RouteInterceptorService,
    TaiXeService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-xuat-kho-gia-cong-cap-nhat',
    templateUrl: './phieu-xuat-kho-gia-cong-cap-nhat.component.html',
    styleUrls: ['./phieu-xuat-kho-gia-cong-cap-nhat.component.css']
})
export class PhieuXuatKhoGiaCongCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatKhoGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieuxuatkhogiacong: PhieuXuatKhoGiaCong;
    public lstKhachHang: KhachHang[] = [];
    public lstTaiXe: TaiXe[] = [];
    public lstXe: DanhSachXe[] = [];
    public lstDonViGiaCong: DonViGiaCong[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public dataSource_TaiXe: DataSource;
    public dataSource_Xe: DataSource;
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatKhoGiaCong_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;
    public loadCapNhat: boolean = true;

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

        private phieuxuatkhogiacongService: PhieuXuatKhoGiaCongService,
        private khachhangService: KhachHangService,
        private taixeService: TaiXeService,
        private xeService: DanhSachXeService,
        private donvigiacongService: DonViGiaCongService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuXuatKhoGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieuxuatkhogiacong = new PhieuXuatKhoGiaCong();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoXuat = x;

                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstDonViGiaCong = x;

                        this.dataSource_DonViGiaCong = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.taixeService.findTaiXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstTaiXe = x;

                this.dataSource_TaiXe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.xeService.findDanhSachXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstXe = x;

                this.dataSource_Xe = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuxuatkhogiacong.khoxuat_id, null, loadOptions)
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

        this.loadingVisible = true;
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieuxuatkho_id = params.id;
                // lấy thông tin
                if (phieuxuatkho_id) {
                    this.subscriptions.add(
                        this.phieuxuatkhogiacongService.findPhieuXuatKhoGiaCong(phieuxuatkho_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieuxuatkhogiacong_chitiets.length;

                                this.phieuxuatkhogiacong = data;
                                this.hanghoas = this.phieuxuatkhogiacong.phieuxuatkhogiacong_chitiets;
                                this.phieuxuatkhogiacong.phieuxuatkhogiacong_chitiets_old = this.phieuxuatkhogiacong.phieuxuatkhogiacong_chitiets;
                            },
                            (error) => {
                                this.phieuxuatkhogiacongService.handleError(error);
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
        if (e.dataField == 'donvigiacong_id' && e.value !== undefined) {
            if (!this.loadCapNhat) {
                let donvigiacong = this.lstDonViGiaCong.find((x) => x.id == this.phieuxuatkhogiacong.donvigiacong_id);
                this.phieuxuatkhogiacong.khogiacong_id = donvigiacong ? donvigiacong.khogiacong_id : null;

                this.phieuxuatkhogiacong.nguoinhan_hoten = donvigiacong ? donvigiacong.tendonvigiacong : null;
                this.phieuxuatkhogiacong.nguoinhan_diachi = donvigiacong ? donvigiacong.diachi : null;
                this.phieuxuatkhogiacong.nguoinhan_dienthoai = donvigiacong ? donvigiacong.sodienthoai : null;

                this.loadCapNhat = false;
            }
        }

        if (e.dataField == 'khogiacong_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khogiacong_id = this.phieuxuatkhogiacong.khogiacong_id;
            });
        }

        if (e.dataField == 'khoxuat_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieuxuatkhogiacong.khoxuat_id;
            });
        }

        if (e.dataField == 'taixe_id') {
            let taixe = this.lstTaiXe.find((x) => x.id == this.phieuxuatkhogiacong.taixe_id);
            this.phieuxuatkhogiacong.taixe_dienthoai = taixe ? taixe.dienthoai : null;
        }
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuXuatKhoGiaCong_ChiTiet());
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
        } else {
            this.hanghoas[index].khoxuat_id = this.phieuxuatkhogiacong.khoxuat_id;
            this.hanghoas[index].khogiacong_id = this.phieuxuatkhogiacong.khogiacong_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
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
        switch (col) {
            case 'soluong':
                this.hanghoas[index].soluong = e.value;
                break;
        }
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuXuatKhoGiaCong.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu số lượng = 0
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieuxuatkhogiacong_req = this.phieuxuatkhogiacong;

        // gán lại dữ liệu
        phieuxuatkhogiacong_req.chinhanh_id = this.currentChiNhanh.id;
        phieuxuatkhogiacong_req.loaiphieuxuat = this.phieuxuatkhogiacong.donvigiacong_id ? 'giacongngoai' : 'taikho';

        phieuxuatkhogiacong_req.phieuxuatkhogiacong_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatkhogiacongService.updatePhieuXuatKhoGiaCong(phieuxuatkhogiacong_req).subscribe(
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
                    this.router.navigate(['/phieu-xuat-kho-gia-cong']);
                    this.frmPhieuXuatKhoGiaCong.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuxuatkhogiacongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
