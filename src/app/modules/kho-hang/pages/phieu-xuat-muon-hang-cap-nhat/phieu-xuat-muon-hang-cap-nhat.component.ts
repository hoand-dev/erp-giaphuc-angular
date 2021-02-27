import { ChiNhanh, PhieuXuatMuonHang, PhieuXuatMuonHang_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, ChiNhanhService, CommonService, KhoHangService, PhieuXuatMuonHangService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-phieu-xuat-muon-hang-cap-nhat',
    templateUrl: './phieu-xuat-muon-hang-cap-nhat.component.html',
    styleUrls: ['./phieu-xuat-muon-hang-cap-nhat.component.css']
})
export class PhieuXuatMuonHangCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatMuonHang: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieuxuatmuonhang: PhieuXuatMuonHang;
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public lstKhoXuat: KhoHang[] = [];
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatMuonHang_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = true;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;

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

        private phieuxuatmuonhangService: PhieuXuatMuonHangService,
        private chinhanhService: ChiNhanhService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuXuatMuonHang.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.phieuxuatmuonhang = new PhieuXuatMuonHang();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.phieuxuatmuonhang.chinhanh_id = x.id;

                // tất cả kho, sau đó lọc lại theo điều kiện
                this.subscriptions.add(
                    this.khohangService.findKhoHangs().subscribe((x) => {
                        this.loadingVisible = false;

                        this.lstKhoXuat = x.filter((z) => z.chinhanh_id == this.currentChiNhanh.id && z.khongoai != true);
                        this.dataSource_KhoXuat = new DataSource({
                            store: this.lstKhoXuat,
                            paginate: true,
                            pageSize: 50
                        });

                        this.lstKhoNhap = x.filter((z) => z.chinhanh_id != this.currentChiNhanh.id || z.khongoai == true);
                        this.dataSource_KhoNhap = new DataSource({
                            store: this.lstKhoNhap,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        this.dataSource_HangHoa = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuxuatmuonhang.khoxuat_id, null, loadOptions)
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

        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieuxuatmuonhang_id = params.id;
                // lấy thông tin
                if (phieuxuatmuonhang_id) {
                    this.subscriptions.add(
                        this.phieuxuatmuonhangService.findPhieuXuatMuonHang(phieuxuatmuonhang_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieuxuatmuonhang_chitiets.length;
                                
                                this.phieuxuatmuonhang = data;
                                this.hanghoas = this.phieuxuatmuonhang.phieuxuatmuonhang_chitiets;
                            },
                            (error) => {
                                this.phieuxuatmuonhangService.handleError(error);
                            }
                        )
                    );
                }
            })
        );
        // thêm sẵn 1 dòng cho user
        // this.onHangHoaAdd();
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khoxuat_id' && e.value !== undefined && e.value !== null) {
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieuxuatmuonhang.khoxuat_id;
            });
            //this.frmPhieuXuatMuonHang.instance.validate();
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.frmPhieuXuatMuonHang.instance.validate();
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuXuatMuonHang_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            setTimeout(() => {
                this.hanghoas[index].mahanghoa = selected.mahanghoa;
                this.hanghoas[index].tenhanghoa = selected.tenhanghoa;
            });
        } else {
            this.hanghoas[index].khoxuat_id = this.phieuxuatmuonhang.khoxuat_id;
            this.hanghoas[index].mahanghoa = selected.mahanghoa;

            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
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
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongtienhang: number = 0;
        this.hanghoas.forEach((v, i) => {
            v.thanhtien = v.soluong * v.dongia;
            tongtienhang += v.thanhtien;
        });
        this.phieuxuatmuonhang.tongthanhtien = tongtienhang;
    }

    // kiểm tra xem 2 kho chọn có khác nhau hay không?
    // nếu chọn khác trả về id kho, compare trả về true và ngược lại luôn false -> show warning
    khohangComparison = () => {
        return this.phieuxuatmuonhang.khoxuat_id != this.phieuxuatmuonhang.khonhap_id ? this.phieuxuatmuonhang.khonhap_id : false;
    };

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieuxuatmuonhang_req = this.phieuxuatmuonhang;

        // gán lại dữ liệu
        phieuxuatmuonhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieuxuatmuonhang_req.phieuxuatmuonhang_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatmuonhangService.updatePhieuXuatMuonHang(phieuxuatmuonhang_req).subscribe(
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
                    this.router.navigate(['/phieu-xuat-muon-hang']);
                    this.frmPhieuXuatMuonHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuxuatmuonhangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
