import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DinhMuc, DonViGiaCong, HangHoa, KhachHang, KhoHang, PhieuYeuCauGiaCong, PhieuYeuCauGiaCongCT, SoMat } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import {
    AppInfoService,
    CommonService,
    DinhMucService,
    DonViGiaCongService,
    HangHoaService,
    KhoHangService,
    PhieuYeuCauGiaCongService,
    RouteInterceptorService,
    SoMatService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-phieu-yeu-cau-gia-cong-them-moi',
    templateUrl: './phieu-yeu-cau-gia-cong-them-moi.component.html',
    styleUrls: ['./phieu-yeu-cau-gia-cong-them-moi.component.css']
})
export class PhieuYeuCauGiaCongThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuYeuCauGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public loaiphieu: string = 'taikho';
    public phieuyeucaugiacong: PhieuYeuCauGiaCong;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuYeuCauGiaCongCT[] = [];
    public lstHangHoa: HangHoa[];
    public lstGiaCong: DinhMuc[];
    public lstSoMat: SoMat[];

    public dataSource_HangHoa: DataSource;
    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;

    // kiểm tra nhấn lấy giá chưa
    private isClicked_LayGia: boolean = false;

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

        private phieuyeucaugiacongService: PhieuYeuCauGiaCongService,
        private donvigiacongService: DonViGiaCongService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private giacongService: DinhMucService,
        private somatService: SoMatService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuYeuCauGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieuyeucaugiacong = new PhieuYeuCauGiaCong();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                
                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
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
                        this.dataSource_DonViGiaCong = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuyeucaugiacong.khogiacong_id, 'hangtron,thanhpham', loadOptions)
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

        let arrLoaiPhieu: string[] = ['taikho', 'ngoai'];

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.loaiphieu) && arrLoaiPhieu.includes(params.loaiphieu)) {
                    this.loaiphieu = params.loaiphieu;

                    this.phieuyeucaugiacong.xuatnguyenlieu = this.loaiphieu == 'taikho' ? true : false;
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

    clickLayGia() {
        this.isClicked_LayGia = true;
        if(this.loaiphieu != 'taikho' && this.phieuyeucaugiacong.donvigiacong_id === null){
            notify(
                {
                    width: 320,
                    message: 'Bạn chưa chọn đơn vị gia công.',
                    position: { my: 'right top', at: 'right top' }
                },
                'warning',
                475
            );
            return;
        }

        this.hanghoas.forEach(e => {
            if(e.hanghoa_id != null)
                this.subscriptions.add(
                    this.phieuyeucaugiacongService.laygiaPhieuYeuCauGiaCong(
                        e.hanghoa_id, 
                        e.yeucaus, 
                        this.loaiphieu == 'taikho' ? null : this.phieuyeucaugiacong.donvigiacong_id
                    )
                    .subscribe((x) => {
                        e.dongia = x;
                    })
                );
        });
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'donvigiacong_id' && e.value !== undefined) {
            let donvigiacong = this.dataSource_DonViGiaCong.items().find((x) => x.id == this.phieuyeucaugiacong.donvigiacong_id);
            this.phieuyeucaugiacong.khogiacong_id = donvigiacong ? donvigiacong.khogiacong_id : null;
        }

        if (e.dataField == 'khogiacong_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khogiacong_id = this.phieuyeucaugiacong.khogiacong_id;
            });
        }

        if (e.dataField == 'xuatnguyenlieu' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.xuatnguyenlieu = this.phieuyeucaugiacong.xuatnguyenlieu;
            });
        }
    }

    displayExprHangHoa(item) {
        return item && item.tenhanghoa ; //+ ' (' + item.soluong_tonhientai + ', ' + item.soluong_tonduocxuat + ')';
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuYeuCauGiaCongCT());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e) {
        this.isClicked_LayGia = false;
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
        } else {
            this.hanghoas[index].khogiacong_id = this.phieuyeucaugiacong.khogiacong_id;
            this.hanghoas[index].xuatnguyenlieu = this.phieuyeucaugiacong.xuatnguyenlieu;
            this.hanghoas[index].dvt_id = selected.dvt_id;
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        this.onTaoThanhPham(index);

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    onYeuCauChanged(index, e) {
        this.isClicked_LayGia = false;
        this.onTaoThanhPham(index);
    }

    onSoMatYeuCauChanged(index, e) {
        let selected = e.selectedItem;
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
        } else {
            // gán số mặt cho thành phẩm
            this.hanghoas[index].somat_thanhpham_id = selected.id;

            // gán giá trị hệ số
            this.hanghoas[index].heso = selected.giatri;
        }
    }

    onSoMatThanhPhamChanged(index, e) {
        let selected = e.selectedItem;
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
        } else {
            /* tạo lại mã mới cho thành phẩm */
            this.onTaoThanhPham(index);
        }
    }

    onTaoThanhPham(index) {
        if (this.hanghoas[index].hanghoa_id != null) {
            let magiacong: string = '';
            let tengiacong: string = '';
            if (this.hanghoas[index].arr_yeucaus != null) {
                this.hanghoas[index].arr_yeucaus.forEach((value, index) => {
                    let giacong = this.lstGiaCong.find((x) => x.id == value);
                    if (typeof giacong === 'object') {
                        magiacong += giacong.madinhmuc;
                        tengiacong += giacong.tendinhmuc + ' ';
                    }
                });

                tengiacong = tengiacong.trim();
            }
            let somat = this.lstSoMat.find((x) => x.id == this.hanghoas[index].somat_thanhpham_id);
            let masomat: string = somat != null ? somat.masomat.toString().trim() : '';
            let tensomat: string = somat != null ? somat.tensomat.toString().trim() : '';

            let _: string = ' ';

            this.subscriptions.add(
                this.hanghoaService.findHangHoa(this.hanghoas[index].hanghoa_id).subscribe((x) => {
                    let hanghoa: HangHoa = x;
                    if (hanghoa != undefined) {
                        if (hanghoa.loaihanghoa == 'thanhpham') {
                            magiacong = magiacong + hanghoa.magiacong;
                            tengiacong = tengiacong + _ + hanghoa.tengiacong;
                        }
                        let mahanghoa: string = magiacong + masomat + hanghoa.matieuchuan + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + hanghoa.ncc + hanghoa.maloaihang;
                        let tenhanghoa: string =
                            tengiacong + _ + tensomat + _ + hanghoa.tentieuchuan + _ + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + _ + hanghoa.ncc + _ + hanghoa.tenloaihang;

                        this.hanghoas[index].mathanhpham = mahanghoa.split('null').join('').trim();
                        this.hanghoas[index].tenthanhpham = tenhanghoa.split('null').join('').trim();

                        if (this.hanghoas[index].arr_yeucaus.length > 0) this.hanghoas[index].yeucaus = this.hanghoas[index].arr_yeucaus.toString();
                    }
                })
            );
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        this.onTinhTien();
    }

    private onTinhTien() {
        let tongtienhang: number = 0;
        this.hanghoas.forEach((v, i) => {
            v.thanhtien = (v.soluong - v.soluongtattoan) * v.dongia * v.heso;
            tongtienhang += v.thanhtien;
        });
        this.phieuyeucaugiacong.tongthanhtien = tongtienhang;
    }

    onValid(){
        if (this.hanghoas.filter((x) => x.heso <= 0).length > 0) {
            Swal.fire({
                title: 'Hệ số phải lớn hơn 0',
                html: 'Vui lòng kiểm tra lại',
                icon: 'warning',
                timer: 3000,
                timerProgressBar: true
            });
            return false;
        }
        return true;
    }

    public async onSubmitForm(e) {
        // kiểm tra nhấn nút lấy giá chưa
        if(!this.isClicked_LayGia){
            const { isConfirmed: confirm } = await Swal.fire({
                title: 'CHƯA LẤY GIÁ',
                html: 'Vui lòng lấy giá!',
                icon: 'warning',
                showConfirmButton: true,
                confirmButtonText: "Đồng ý"
            });
            //if(!confirm) return;
            return;
        }
        if(!this.onValid()) return;

        // bỏ qua các dòng dữ liệu số lượng = 0
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieuyeucaugiacong_req = this.phieuyeucaugiacong;

        // gán lại dữ liệu
        phieuyeucaugiacong_req.chinhanh_id = this.currentChiNhanh.id;
        phieuyeucaugiacong_req.loaiphieu = this.loaiphieu;
        phieuyeucaugiacong_req.phieuyeucaugiacong_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuyeucaugiacongService.addPhieuYeuCauGiaCong(phieuyeucaugiacong_req).subscribe(
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
                    this.router.navigate(['/phieu-yeu-cau-gia-cong']);
                    this.frmPhieuYeuCauGiaCong.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuyeucaugiacongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
