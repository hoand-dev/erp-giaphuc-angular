import { ChiNhanh, PhieuXuatChuyenKho, PhieuXuatChuyenKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, KhoHangService, PhieuXuatChuyenKhoService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';

@Component({
    selector: 'app-phieu-xuat-chuyen-kho-them-moi',
    templateUrl: './phieu-xuat-chuyen-kho-them-moi.component.html',
    styleUrls: ['./phieu-xuat-chuyen-kho-them-moi.component.css']
})
export class PhieuXuatChuyenKhoThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatChuyenKho: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public phieuxuatchuyenkho: PhieuXuatChuyenKho;

    public lstKhoHang: KhoHang[] = [];
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatChuyenKho_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

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

        private phieuxuatchuyenkhoService: PhieuXuatChuyenKhoService,
        private khoxuatchuyenService: KhoHangService,
        private hanghoaService: HangHoaService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuXuatChuyenKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.phieuxuatchuyenkho = new PhieuXuatChuyenKho();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.subscriptions.add(
                    this.khoxuatchuyenService.findKhoHangs(x.id).subscribe((x) => {
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
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'khoxuatchuyen_id' && e.value !== undefined && e.value !== null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            this.isValidForm = true;

            this.hanghoas.forEach((v, i) => {
                v.khoxuatchuyen_id = this.phieuxuatchuyenkho.khoxuatchuyen_id;
            });
            this.frmPhieuXuatChuyenKho.instance.validate();
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.frmPhieuXuatChuyenKho.instance.validate();
        }

        // // nếu thay đổi chiết khấu -> set chiết khấu hàng hoá = 0
        // if (e.dataField == 'chietkhau' && e.value != 0) {
        //     this.hanghoas.forEach((v, i) => {
        //         v.chietkhau = 0;
        //     });
        // }

        // // nếu thay đổi thuế vat -> set thuế vat hàng hoá = 0
        // if (e.dataField == 'thuevat' && e.value != 0) {
        //     this.hanghoas.forEach((v, i) => {
        //         v.thuevat = 0;
        //     });
        // }

        // tính tổng tiền
         this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuXuatChuyenKho_ChiTiet());
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
            setTimeout(() => {
                this.hanghoas[index].mahanghoa = selected.mahanghoa;
                this.hanghoas[index].tenhanghoa = selected.tenhanghoa;
            });
        } else {
            this.hanghoas[index].khoxuatchuyen_id = this.phieuxuatchuyenkho.khoxuatchuyen_id;

            this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas[index].mahanghoa = selected.mahanghoa;
            this.hanghoas[index].tenhanghoa = selected.tenhanghoa;

            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

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
    }

    // kiểm tra xem 2 kho chọn có khác nhau hay không? nếu chọn khác trả về id kho nhập compare trả về true và ngược lại luôn false -> show warning
    khoxuatComparison = () => {
        return this.phieuxuatchuyenkho.khoxuatchuyen_id != this.phieuxuatchuyenkho.khonhap_id ? this.phieuxuatchuyenkho.khonhap_id : false;
    };

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null && x.soluong != 0);
        let phieuxuatchuyenkho_req = this.phieuxuatchuyenkho;

        // gán lại dữ liệu
        phieuxuatchuyenkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieuxuatchuyenkho_req.phieuxuatchuyenkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatchuyenkhoService.addPhieuXuatChuyenKho(phieuxuatchuyenkho_req).subscribe(
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
                    this.router.navigate(['/phieu-xuat-chuyen-kho']);
                    this.frmPhieuXuatChuyenKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuxuatchuyenkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
