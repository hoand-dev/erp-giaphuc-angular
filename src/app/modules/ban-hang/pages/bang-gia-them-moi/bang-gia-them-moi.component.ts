import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BangGia, BangGia_ChiTiet, ChiNhanh, DanhMucNo, KhachHang, KhoHang } from '@app/shared/entities';
import { AppInfoService, BangGiaService, CommonService, DanhMucNoService, HangHoaService, KhachHangService, KhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-bang-gia-them-moi',
    templateUrl: './bang-gia-them-moi.component.html',
    styleUrls: ['./bang-gia-them-moi.component.css']
})
export class BangGiaThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuDatHang: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public banggia: BangGia;

    public lstKhachHang: KhachHang[] = [];
    public lstDanhMucNo: DanhMucNo[] = [];
    public lstKhoHang: KhoHang[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_DanhMucNo: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_HangHoa: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: BangGia_ChiTiet[] = [];

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private banggiaService: BangGiaService,
        private khachhangService: KhachHangService,
        private danhmucnoService: DanhMucNoService,
        private khohangService: KhoHangService,

        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuDatHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    onChangeFile(event) {
        let file = event.srcElement.files;
        this.subscriptions.add(
            this.banggiaService.uploadExcel(file).subscribe(
                (x) => {
                    this.loadingVisible = false;
                    this.hanghoas = [];
                    this.hanghoas = x.filter((v) => v.hanghoa_id != null);
                },
                (error) => {
                    this.banggiaService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.banggia = new BangGia();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
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
            this.danhmucnoService.findDanhMucNos().subscribe((x) => {
                this.loadingVisible = false;
                this.lstDanhMucNo = x;
                this.dataSource_DanhMucNo = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas().subscribe((x) => {
                this.loadingVisible = false;

                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.saochep)) {
                    this.hanghoas = [];
                    // lấy thông tin phiếu đặt hàng ncc từ api
                    this.banggiaService.findBangGia(params.saochep).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            /* phiếu đặt hàng ncc -> phiếu mua hàng ncc */
                            // xử lý phần thông tin phiếu
                            this.banggia.khachhang_id = data.khachhang_id;
                            this.banggia.noidungno_id = data.noidungno_id;

                            // xử lý phần thông tin chi tiết phiếu
                            data.banggia_chitiet.forEach((value, index) => {
                                let item = new BangGia_ChiTiet();

                                item.loaihanghoa = value.loaihanghoa;
                                item.hanghoa_id = value.hanghoa_id;
                                item.dvt_id = value.dvt_id;
                                item.tilequydoi = value.tilequydoi;
                                item.dongia = value.dongia;
                                item.dongiacothue = value.dongiacothue;
                                item.tenhanghoa_inphieu = value.tenhanghoa_inphieu;
                                this.hanghoas.push(item);
                            });
                        },
                        (error) => {
                            this.banggiaService.handleError(error);
                        }
                    );
                }
            })
        );
    }

    ngOnDestroy(): void {
        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value != null) {
            let khachhang = this.lstKhachHang.find((o) => o.id == this.banggia.khachhang_id);
            this.banggia.tenkhachhang = khachhang.tenkhachhang;
            this.banggia.diachi = khachhang.diachi;
            this.banggia.sodienthoai = khachhang.sodienthoai;
        }
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new BangGia_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        this.hanghoas[index].dvt_id = selected.dvt_id;
        /*
        this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;
        this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
        this.hanghoas[index].dongiacothue = this.hanghoas[index].dongia;
        */

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
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
        }
    }

    public onSubmitForm(e) {
        if (!this.frmPhieuDatHang.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let banggia_req = this.banggia;

        // gán lại dữ liệu
        banggia_req.chinhanh_id = this.currentChiNhanh.id;
        banggia_req.banggia_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.banggiaService.addBangGia(banggia_req).subscribe(
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
                    this.router.navigate(['/bang-gia']);
                    this.frmPhieuDatHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.banggiaService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
