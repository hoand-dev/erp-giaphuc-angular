import { ChiNhanh, DinhMuc, DinhMuc_ChiPhiKhac, DinhMuc_NguonLuc, DinhMuc_NguyenLieu } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, DanhMucGiaCongService, DinhMucService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { DanhMucGiaCong } from '@app/shared/entities';

import { HangHoaService } from '@app/shared/services';
import { NoiDungThuChiService } from '@app/shared/services';
import { NguonNhanLucService } from '@app/shared/services';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';

@Component({
    selector: 'app-dinh-muc-them-moi',
    templateUrl: './dinh-muc-them-moi.component.html',
    styleUrls: ['./dinh-muc-them-moi.component.css']
})
export class DinhMucThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmDinhMuc: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public dinhmuc: DinhMuc;

    public lstGiaCong: DanhMucGiaCong[] = [];
    public dataSource_GiaCong: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    public hanghoas: DinhMuc_NguyenLieu[] = [];
    public nguonlucs: DinhMuc_NguonLuc[] = [];
    public chiphikhacs: DinhMuc_ChiPhiKhac[] = [];

    dataSource_HangHoa: any = {};
    dataSource_NguonLuc: any = {};
    dataSource_ChiPhiKhac: any = {};

    constructor(
        public sumTotal: SumTotalPipe,
        public appInfoService: AppInfoService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private giacongService: DanhMucGiaCongService,
        private dinhmucService: DinhMucService,
        private hanghoaService: HangHoaService,
        private noidungchiService: NoiDungThuChiService,
        private nguonnhanlucService: NguonNhanLucService
    ) {}

    ngAfterViewInit() {
        // this.frmDinhMuc.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.dinhmuc = new DinhMuc();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.giacongService.findDanhMucGiaCongs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstGiaCong = x;

                this.dataSource_GiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.loadingVisible = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas(this.appInfoService.loaihanghoa_nguyenlieu).subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.loadingVisible = true;
        this.subscriptions.add(
            this.nguonnhanlucService.findNguonNhanLucs().subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_NguonLuc = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.loadingVisible = true;
        this.subscriptions.add(
            this.noidungchiService.findNoiDungThuChis('chi').subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_ChiPhiKhac = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.onHangHoaAdd();
        this.onNguonLucAdd();
        this.onChiPhiKhacAdd();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.dinhmucService.checkExistDinhMuc(params.value);
    }

    onHangHoaAdd() {
        this.hanghoas.push(new DinhMuc_NguyenLieu());
    }

    onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
    }

    onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        this.hanghoas[index].dvt_id = selected.dvt_id;
        this.hanghoas[index].loainguyenlieu = selected.loaihanghoa;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
        this.hanghoas[index].thanhtien_chiphi = this.hanghoas[index].soluong * this.hanghoas[index].dongia;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.nguyenlieu_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    onHangHoaChangeRow(col: string, index: number, e: any) {
        switch (col) {
            case 'soluong':
                this.hanghoas[index].soluong = e.value;
                break;
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
        }
        this.hanghoas[index].thanhtien_chiphi = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
    }

    // các thao tác trên tab nguồn lực
    onNguonLucAdd() {
        this.nguonlucs.push(new DinhMuc_NguonLuc());
    }

    onNguonLucDelete(item) {
        this.nguonlucs = this.nguonlucs.filter(function (i) {
            return i !== item;
        });
    }

    onNguonLucChanged(i, e) {
        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.nguonlucs.filter((x) => x.nguonnhanluc_id == null);
        if (rowsNull.length == 0) {
            this.onNguonLucAdd();
        }
    }

    // các thao tác trên tab chi phí khác
    onChiPhiKhacAdd() {
        this.chiphikhacs.push(new DinhMuc_ChiPhiKhac());
    }

    onChiPhiKhacDelete(item) {
        this.chiphikhacs = this.chiphikhacs.filter(function (i) {
            return i !== item;
        });
    }

    onChiPhiKhacChanged(i, e) {
        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.chiphikhacs.filter((x) => x.noidung_id == null);
        if (rowsNull.length == 0) {
            this.onChiPhiKhacAdd();
        }
    }

    onSubmitForm(e) {
        if (!this.frmDinhMuc.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.nguyenlieu_id != null);
        let nguonlucs = this.nguonlucs.filter((x) => x.nguonnhanluc_id != null);
        let chiphikhacs = this.chiphikhacs.filter((x) => x.noidung_id != null);

        let dinhmuc_req = this.dinhmuc;

        // gán lại dữ liệu
        dinhmuc_req.chinhanh_id = this.currentChiNhanh.id;

        dinhmuc_req.dinhmuc_nguyenlieu = hanghoas;
        dinhmuc_req.dinhmuc_nguonluc = nguonlucs;
        dinhmuc_req.dinhmuc_chiphikhac = chiphikhacs;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.dinhmucService.addDinhMuc(dinhmuc_req).subscribe(
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
                    this.router.navigate(['/dinh-muc']);
                    this.frmDinhMuc.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.dinhmucService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
