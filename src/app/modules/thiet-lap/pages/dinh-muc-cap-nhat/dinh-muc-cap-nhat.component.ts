import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DinhMuc, DanhMucGiaCong, DinhMuc_ChiPhiKhac, DinhMuc_NguonLuc, DinhMuc_NguyenLieu } from '@app/shared/entities';
import { DinhMucService, DanhMucGiaCongService, HangHoaService, NguonNhanLucService, NoiDungThuChiService, AppInfoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dinh-muc-cap-nhat',
    templateUrl: './dinh-muc-cap-nhat.component.html',
    styleUrls: ['./dinh-muc-cap-nhat.component.css']
})
export class DinhMucCapNhatComponent implements OnInit, OnDestroy {
    @ViewChild(DxFormComponent, { static: false }) frmDinhMuc: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public dinhmuc: DinhMuc;

    public lstGiaCong: DanhMucGiaCong[] = [];
    public dataSource_GiaCong: DataSource;

    public madinhmuc_old: string;
    public saveProcessing = false;

    // các danh sách dữ liệu bảng con
    public hanghoas: DinhMuc_NguyenLieu[] = [];
    public nguonlucs: DinhMuc_NguonLuc[] = [];
    public chiphikhacs: DinhMuc_ChiPhiKhac[] = [];

    // dữ liệu các select box tương ứng từng tab
    public dataSource_HangHoa: any = {};
    public dataSource_NguonLuc: any = {};
    public dataSource_ChiPhiKhac: any = {};

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    public rules: Object = { X: /[02-9]/ };
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
        private giacongService: DanhMucGiaCongService,
        private dinhmucService: DinhMucService,
        private hanghoaService: HangHoaService,
        private noidungchiService: NoiDungThuChiService,
        private nguonnhanlucService: NguonNhanLucService,
    ) {}

    ngOnInit(): void {
        this.dinhmuc = new DinhMuc();

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));

        this.subscriptions.add(
            this.giacongService.findDanhMucGiaCongs().subscribe((data) => {
                this.lstGiaCong = data;
                
                this.dataSource_GiaCong = new DataSource({
                    store: data,
                    paginate: true,
                    pageSize: 50
                    });
            })
        );

        this.saveProcessing = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas(this.appInfoService.loaihanghoa_nguyenlieu).subscribe((x) => {
                this.saveProcessing = false;
                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.saveProcessing = true;
        this.subscriptions.add(
            this.nguonnhanlucService.findNguonNhanLucs().subscribe((x) => {
                this.saveProcessing = false;
                this.dataSource_NguonLuc = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.saveProcessing = true;
        this.subscriptions.add(
            this.noidungchiService.findNoiDungThuChis().subscribe((x) => {
                this.saveProcessing = false;
                this.dataSource_ChiPhiKhac = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let dinhmuc_id = params.id;
                // lấy thông tin định mức
                if (dinhmuc_id) {
                    this.subscriptions.add(
                        this.dinhmucService.findDinhMuc(dinhmuc_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.dinhmuc_nguyenlieu.length;

                                this.dinhmuc = data;
                                this.madinhmuc_old = this.dinhmuc.madinhmuc;
                                
                                this.hanghoas = this.dinhmuc.dinhmuc_nguyenlieu;
                                this.nguonlucs = this.dinhmuc.dinhmuc_nguonluc;
                                this.chiphikhacs = this.dinhmuc.dinhmuc_chiphikhac;
                            },
                            (error) => {
                                this.dinhmucService.handleError(error);
                            }
                        )
                    );
                }
            })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params){
        return this.dinhmucService.checkExistDinhMuc(params.value, this.madinhmuc_old);
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
        // lấy thông tin hàng hóa
        let selected = e.selectedItem;

        // không cần xử lý lại thông tin nếu load lần dầu (*)
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
        } else {
            // xử lý lại thông tin dựa trên lựa chọn
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien_chiphi = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

        // chỉ thêm row mới khi không tồn tại dòng rỗng nào
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
            this.dinhmucService.updateDinhMuc(dinhmuc_req).subscribe(
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
                    // this.frmDinhMuc.instance.resetValues();
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
