import { ChiNhanh, KhoHang, PhieuNhapKho, PhieuNhapKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, KhoHangService, NhaCungCapService, PhieuNhapKhoService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { NhaCungCap } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-phieu-nhap-kho-cap-nhat',
    templateUrl: './phieu-nhap-kho-cap-nhat.component.html',
    styleUrls: ['./phieu-nhap-kho-cap-nhat.component.css']
})
export class PhieuNhapKhoCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapKho: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieunhapkho: PhieuNhapKho;
    public lstNhaCungCap: NhaCungCap[] = [];
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapKho_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

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
        public appInfoService: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private phieunhapkhoService: PhieuNhapKhoService,
        private nhacungcapService: NhaCungCapService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieunhapkho = new PhieuNhapKho();
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
                this.lstKhoNhap = x;
                
                this.dataSource_KhoNhap = new DataSource({
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
                let phieunhapkho_id = params.id;
                // lấy thông tin
                if (phieunhapkho_id) {
                    this.subscriptions.add(
                        this.phieunhapkhoService.findPhieuNhapKho(phieunhapkho_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieunhapkho_chitiets.length;

                                this.phieunhapkho = data;
                                this.hanghoas = this.phieunhapkho.phieunhapkho_chitiets;
                                this.phieunhapkho.phieunhapkho_chitiets_old = this.phieunhapkho.phieunhapkho_chitiets;
                            },
                            (error) => {
                                this.phieunhapkhoService.handleError(error);
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

        //     this.phieunhapkho.nhacungcap_id = e.value ? e.value.id : null;
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
        if (e.dataField == 'khonhap_id' && e.value != null) {
            this.isValidForm = true;
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapkho.khonhap_id;
            });
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuNhapKho_ChiTiet());
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
            this.hanghoas[index].khonhap_id = this.phieunhapkho.khonhap_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;

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
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieunhapkho.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieunhapkho.thuevat = 0;
                }
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
            v.thanhtien = v.thanhtien - v.thanhtien * v.chietkhau + (v.thanhtien - v.thanhtien * v.chietkhau) * v.thuevat;

            tongtienhang += v.thanhtien;
        });
        this.phieunhapkho.tongtienhang = tongtienhang;
        this.phieunhapkho.tongthanhtien = tongtienhang - tongtienhang * this.phieunhapkho.chietkhau + (tongtienhang - tongtienhang * this.phieunhapkho.chietkhau) * this.phieunhapkho.thuevat;
    }

    public valid_khonhaphong(): boolean{
        if(this.hanghoas.filter((x) => x.soluonghong != 0 && x.khonhaphong_id == null).length > 0){
            Swal.fire({
                title: 'Chọn kho nhập hỏng',
                html: 'Vui lòng chọn kho nhập cho số lượng hỏng đã nhập',
                icon: 'warning',
                timer: 3000,
                timerProgressBar: true
            });
            return false;
        }
        return true;
    }

    public onSubmitForm(e) {
        if(!this.valid_khonhaphong()) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null && (x.soluong != 0 || x.soluonghong != 0));
        let phieunhapkho_req = this.phieunhapkho;

        // gán lại dữ liệu
        phieunhapkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhapkho_req.phieunhapkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhapkhoService.updatePhieuNhapKho(phieunhapkho_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-kho']);
                    this.frmPhieuNhapKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhapkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
