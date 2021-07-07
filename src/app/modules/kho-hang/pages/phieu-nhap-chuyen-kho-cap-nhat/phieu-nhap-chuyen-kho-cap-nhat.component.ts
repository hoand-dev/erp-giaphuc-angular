import { ChiNhanh, KhoHang, PhieuNhapChuyenKho, PhieuNhapChuyenKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, KhoHangService, NhaCungCapService, PhieuNhapChuyenKhoService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { NhaCungCap } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';

@Component({
    selector: 'app-phieu-nhap-chuyen-kho-cap-nhat',
    templateUrl: './phieu-nhap-chuyen-kho-cap-nhat.component.html',
    styleUrls: ['./phieu-nhap-chuyen-kho-cap-nhat.component.css']
})
export class PhieuNhapChuyenKhoCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapChuyenKho: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieunhapchuyenkho: PhieuNhapChuyenKho;
    public lstKhoHang: KhoHang[] = [];
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapChuyenKho_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;
    public dataSource_LoHang: DataSource[] = [];

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public sumTotal: SumTotalPipe,
        public appInfoService: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private phieunhapchuyenkhoService: PhieuNhapChuyenKhoService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapChuyenKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieunhapchuyenkho = new PhieuNhapChuyenKho();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        // ? lấy danh sách kho hàng theo chi nhánh hiện tại
        this.loadingVisible = true;
        this.subscriptions.add(
            this.khohangService.findKhoHangs(this.currentChiNhanh.id).subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhoHang = x;

                this.dataSource_KhoHang = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, null, null, loadOptions)
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
                let phieunhapchuyenkho_id = params.id;
                // lấy thông tin
                if (phieunhapchuyenkho_id) {
                    this.subscriptions.add(
                        this.phieunhapchuyenkhoService.findPhieuNhapChuyenKho(phieunhapchuyenkho_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieunhapchuyenkho_chitiets.length;

                                this.phieunhapchuyenkho = data;
                                this.hanghoas = this.phieunhapchuyenkho.phieunhapchuyenkho_chitiets;
                            },
                            (error) => {
                                this.phieunhapchuyenkhoService.handleError(error);
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
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        if (e.value === undefined) return;

        // nếu thay đổi nhà cung cấp
        // if (e.dataField == 'nhacungcap' && e.value !== undefined) {
        //     // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
        //     this.isValidForm = true;

        //     // gán lại thông tin điện thoại + địa chỉ nhà cung cấp

        //     this.phieunhapchuyenkho.nhacungcap_id = e.value ? e.value.id : null;
        // }

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

        // nếu thay đổi kho xuất -> set khonhap_id cho hàng hoá
        if (e.dataField == 'khonhap_id') {
            this.isValidForm = true;
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapchuyenkho.khonhap_id;
            });
            this.frmPhieuNhapChuyenKho.instance.validate();
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.frmPhieuNhapChuyenKho.instance.validate();
        }

        // tính tổng tiền
        // this.onTinhTien();
    }

    onLoadDataSourceLo(index, hanghoa_id) {
        this.dataSource_LoHang[index] = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoaLoHang_TonKhoHienTai(this.currentChiNhanh.id, null, hanghoa_id, loadOptions)
                        .toPromise()
                        .then((result) => {
                            return result;
                        });
                },
                byKey: (key) => {
                    return this.hanghoaService
                        .findLoHang(key)
                        .toPromise()
                        .then((result) => {
                            return result;
                        });
                }
            })
        });
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuNhapChuyenKho_ChiTiet());
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
            this.hanghoas[index].khonhap_id = this.phieunhapchuyenkho.khonhap_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].hanghoa_lohang_id = null;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        this.onLoadDataSourceLo(index, selected.id);

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            //this.onHangHoaAdd();
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
            /* case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieunhapchuyenkho.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieunhapchuyenkho.thuevat = 0;
                }
                break; */
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.tongtrongluong = v.soluong * v.trongluong;
            v.tongkien       = v.tendonvitinhphu ? v.soluong / v.tilequydoiphu : 0;
            v.tongm3         = v.soluong * v.m3;
            v.soluongconlai  = v.soluong;

            v.thanhtien = v.soluong * v.dongia;
            tongtienhang += v.thanhtien;
        });
        //this.phieunhapchuyenkho.tongtienhang = tongtienhang;
        //this.phieunhapchuyenkho.tongthanhtien = tongtienhang - tongtienhang * this.phieunhapchuyenkho.chietkhau + (tongtienhang - tongtienhang * this.phieunhapchuyenkho.chietkhau) * this.phieunhapchuyenkho.thuevat;
    }

    // kiểm tra xem 2 kho chọn có khác nhau hay không? nếu chọn khác trả về id kho nhập compare trả về true và ngược lại luôn false -> show warning
    khoxuatComparison = () => {
        return this.phieunhapchuyenkho.khoxuatchuyen_id != this.phieunhapchuyenkho.khonhap_id ? this.phieunhapchuyenkho.khonhap_id : false;
    };

    public onSubmitForm(e) {
        if (!this.frmPhieuNhapChuyenKho.instance.validate().isValid) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieunhapchuyenkho_req = this.phieunhapchuyenkho;

        // gán lại dữ liệu
        phieunhapchuyenkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapchuyenkho_req.phieunhapchuyenkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapchuyenkhoService.updatePhieuNhapChuyenKho(phieunhapchuyenkho_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-chuyen-kho']);
                    this.frmPhieuNhapChuyenKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhapchuyenkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
