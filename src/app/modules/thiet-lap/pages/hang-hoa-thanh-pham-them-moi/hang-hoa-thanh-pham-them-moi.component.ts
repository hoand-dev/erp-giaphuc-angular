import { ChiNhanh, DanhMucLoi, DinhMuc, DonViTinh, HangHoa, SoMat } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, DanhMucLoiService, DinhMucService, DonViTinhService, HangHoaService, SoMatService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { DanhMucTieuChuan } from '../../../../shared/entities/thiet-lap/danh-muc-tieu-chuan';
import { LoaiHang } from '../../../../shared/entities/thiet-lap/loai-hang';
import { DanhMucTieuChuanService } from '../../../../shared/services/thiet-lap/danh-muc-tieu-chuan.service';
import { LoaiHangService } from '../../../../shared/services/thiet-lap/loai-hang.service';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'app-hang-hoa-thanh-pham-them-moi',
    templateUrl: './hang-hoa-thanh-pham-them-moi.component.html',
    styleUrls: ['./hang-hoa-thanh-pham-them-moi.component.css']
})
export class HangHoaThanhPhamThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmHangHoa: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public hanghoa: HangHoa;

    public lstTieuChuan: DanhMucTieuChuan[] = [];
    public lstLoaiHang: LoaiHang[] = [];
    public lstLoi: DanhMucLoi[] = [];
    public lstGiaCong: DinhMuc[] = [];
    public lstSoMat: SoMat[] = [];
    public lstDonViTinh: DonViTinh[] = [];

    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;
    public dataSource_TieuChuan: DataSource;
    public dataSource_LoaiHang: DataSource;
    public dataSource_Loi: DataSource;
    public dataSource_DonViTinh: DataSource;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private tieuchuanService: DanhMucTieuChuanService,
        private loaihangService: LoaiHangService,
        private loiService: DanhMucLoiService,
        private giacongService: DinhMucService,
        private somatService: SoMatService,
        private donvitinhService: DonViTinhService,
        private hanghoaService: HangHoaService
    ) {}

    ngAfterViewInit() {
        // this.frmHangHoa.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.hanghoa = new HangHoa();
        this.hanghoa.loaihanghoa = this.appInfoService.loaihanghoa_thanhpham;

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
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
        this.subscriptions.add(
            this.tieuchuanService.findDanhMucTieuChuans().subscribe((x) => {
                this.lstTieuChuan = x;

                this.dataSource_TieuChuan = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.loaihangService.findLoaiHangs().subscribe((x) => {
                this.lstLoaiHang = x;

                this.dataSource_LoaiHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.loiService.findDanhMucLois().subscribe((x) => {
                this.lstLoi = x;

                this.dataSource_Loi = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.donvitinhService.findDonViTinhs().subscribe((x) => {
                this.lstDonViTinh = x;

                this.dataSource_DonViTinh = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.hanghoaService.checkExistHangHoa(params.value);
    }

    checkQuyDoi(params) {
        if (params.value <= 0) {
            return false;
        }
        return true;
    }

    form_fieldDataChanged(e) {
        /* tạo mã + tên hàng hóa */
        if (
            e.dataField == 'dinhmuc_giacong' ||
            e.dataField == 'somat_id' ||
            e.dataField == 'tieuchuan_id' ||
            e.dataField == 'day' ||
            e.dataField == 'rong' ||
            e.dataField == 'dai' ||
            e.dataField == 'ncc' ||
            e.dataField == 'loaihang_id' ||
            e.dataField == 'loi_id'
        ) {
            let somat: SoMat = this.lstSoMat.find((x) => x.id == this.hanghoa.somat_id);
            let tieuchuan: DanhMucTieuChuan = this.lstTieuChuan.find((x) => x.id == this.hanghoa.tieuchuan_id);
            let loaihang: LoaiHang = this.lstLoaiHang.find((x) => x.id == this.hanghoa.loaihang_id);
            let loi: DanhMucLoi = this.lstLoi.find((x) => x.id == this.hanghoa.loi_id);

            let magiacong: string = '';
            let tengiacong: string = '';
            if (this.hanghoa.dinhmuc_giacong != null) {
                this.hanghoa.dinhmuc_giacong.forEach((value, index) => {
                    if (typeof value === 'object') {
                        magiacong += value.madinhmuc;
                        tengiacong += value.tendinhmuc + ' ';
                    }
                });

                tengiacong = tengiacong.trim();
            }
            let masomat: string = somat != null ? somat.masomat.toString().trim() : '';
            let tensomat: string = somat != null ? somat.tensomat.toString().trim() : '';

            let matieuchuan: string = tieuchuan != null ? tieuchuan.madanhmuctieuchuan.toString().trim() : '';
            let tentieuchuan: string = tieuchuan != null ? tieuchuan.tendanhmuctieuchuan.toString().trim() : '';
            let day: string = this.hanghoa.day != null ? this.hanghoa.day.toString().trim() : '';
            let rong: string = this.hanghoa.rong != null ? 'x' + this.hanghoa.rong.toString().trim() : '';
            let dai: string = this.hanghoa.dai != null ? 'x' + this.hanghoa.dai.toString().trim() : '';
            let ncc: string = this.hanghoa.ncc != null ? this.hanghoa.ncc.toString().trim() : '';
            let maloaihang: string = loaihang != null ? loaihang.maloaihang.toString().trim() : '';
            let tenloaihang: string = loaihang != null ? loaihang.tenloaihang.toString().trim() : '';

            let _: string = ' ';

            let maloi: string = loi != null ? loi.madanhmucloi.toString().trim() : '';
            let tenloi: string = loi != null ? loi.tendanhmucloi.toString().trim() + _ : '';

            let mahanghoa: string = maloi + magiacong + masomat + matieuchuan + '(' + day + rong + dai + ')' + ncc + maloaihang;
            let tenhanghoa: string = tenloi + tengiacong + _ + tensomat + _ + tentieuchuan + _ + '(' + day + rong + dai + ')' + _ + ncc + _ + tenloaihang;

            this.hanghoa.mahanghoa = mahanghoa.split('null').join('').trim();
            this.hanghoa.tenhanghoa = tenhanghoa.split('null').join('').trim();
        }

        /* tính m3/tấm */
        if (e.dataField == 'day' || e.dataField == 'rong' || e.dataField == 'dai') {
            let day: number = this.hanghoa.day != null ? this.hanghoa.day : 0;
            let rong: number = this.hanghoa.rong != null ? this.hanghoa.rong : 0;
            let dai: number = this.hanghoa.dai != null ? this.hanghoa.dai : 0;
            let m3: number = (day * rong * dai) / 1000000000;
            this.hanghoa.m3 = m3;
        }
    }

    onSubmitForm(e) {
        if (!this.frmHangHoa.instance.validate().isValid) return;

        let hanghoa_req = this.hanghoa;
        hanghoa_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.hanghoaService.addHangHoa(hanghoa_req).subscribe(
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
                    this.router.navigate(['/hang-hoa-thanh-pham']); // chuyển trang sau khi thêm
                    this.frmHangHoa.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.hanghoaService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
