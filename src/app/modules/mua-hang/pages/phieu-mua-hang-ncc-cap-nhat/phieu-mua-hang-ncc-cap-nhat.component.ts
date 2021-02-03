import { ChiNhanh, PhieuMuaHangNCC, PhieuMuaHangNCC_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, NhaCungCapService, PhieuMuaHangNCCService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { NhaCungCap } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-phieu-mua-hang-ncc-cap-nhat',
    templateUrl: './phieu-mua-hang-ncc-cap-nhat.component.html',
    styleUrls: ['./phieu-mua-hang-ncc-cap-nhat.component.css']
})
export class PhieuMuaHangNCCCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuMuaHangNCC: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public phieumuahangncc: PhieuMuaHangNCC;

    public lstNhaCungCap: NhaCungCap[] = [];
    public dataSource_NhaCungCap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuMuaHangNCC_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // tất toán
    public isTatToan: boolean = false;

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
        private phieumuahangnccService: PhieuMuaHangNCCService,
        private nhacungcapService: NhaCungCapService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuMuaHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieumuahangncc = new PhieuMuaHangNCC();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNhaCungCap = x;

                this.dataSource_NhaCungCap = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
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
                let phieumuahangncc_id = params.id;
                // lấy thông tin
                if (phieumuahangncc_id) {
                    this.subscriptions.add(
                        this.phieumuahangnccService.findPhieuMuaHangNCC(phieumuahangncc_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieumuahangncc_chitiet.length;

                                this.phieumuahangncc = data;
                                this.hanghoas = this.phieumuahangncc.phieumuahangncc_chitiet;
                            },
                            (error) => {
                                this.phieumuahangnccService.handleError(error);
                            }
                        )
                    );
                }
            })
        );

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tattoan)) {
                    this.isTatToan = true;
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
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'nhacungcap_id' && e.value !== undefined) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ nhà cung cấp
            let nhacungcap = this.lstNhaCungCap.find((x) => x.id == this.phieumuahangncc.nhacungcap_id);
            this.phieumuahangncc.dienthoainhacungcap = nhacungcap ? nhacungcap.sodienthoai : null;
            this.phieumuahangncc.diachinhacungcap = nhacungcap ? nhacungcap.diachi : null;

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieumuahangncc.nhacungcap_id, this.currentChiNhanh.id, this.phieumuahangncc.sort).subscribe((data) => {
                    this.phieumuahangncc.nocu = data;
                })
            );
        }

        // nếu thay đổi chiết khấu -> set chiết khấu hàng hoá = 0
        if (e.dataField == 'chietkhau' && e.value != 0) {
            this.hanghoas.forEach((v, i) => {
                v.chietkhau = 0;
            });
        }

        // nếu thay đổi thuế vat -> set thuế vat hàng hoá = 0
        if (e.dataField == 'thuevat' && e.value != 0) {
            this.hanghoas.forEach((v, i) => {
                v.thuevat = 0;
            });
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuMuaHangNCC_ChiTiet());
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
            //return;
        } else {
            this.hanghoas[index].dvt_id = selected.dvt_id;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        // let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        // if (rowsNull.length == 0) {
        //     this.onHangHoaAdd();
        // }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        switch (col) {
            case 'soluongtattoan':
                this.hanghoas[index].soluongtattoan = e.value;
                break;
            case 'soluong':
                this.hanghoas[index].soluong = e.value;
                break;
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieumuahangncc.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieumuahangncc.thuevat = 0;
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
            v.thanhtien = (v.soluong - v.soluongtattoan) * v.dongia;
            v.thanhtien = v.thanhtien - v.thanhtien * v.chietkhau + (v.thanhtien - v.thanhtien * v.chietkhau) * v.thuevat;
            tongtienhang += v.thanhtien;
        });
        this.phieumuahangncc.tongtienhang = tongtienhang;
        this.phieumuahangncc.tongthanhtien =
            tongtienhang - tongtienhang * this.phieumuahangncc.chietkhau + (tongtienhang - tongtienhang * this.phieumuahangncc.chietkhau) * this.phieumuahangncc.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieumuahangncc_req = this.phieumuahangncc;

        // gán lại dữ liệu
        phieumuahangncc_req.chinhanh_id = this.currentChiNhanh.id;
        phieumuahangncc_req.phieumuahangncc_chitiet = hanghoas;

        this.saveProcessing = true;

        if (this.isTatToan)
            this.subscriptions.add(
                this.phieumuahangnccService.updateTatToanPhieuMuaHangNCC(phieumuahangncc_req).subscribe(
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
                        this.router.navigate(['/phieu-mua-hang-ncc']);
                        this.frmPhieuMuaHangNCC.instance.resetValues();
                        this.saveProcessing = false;
                    },
                    (error) => {
                        this.phieumuahangnccService.handleError(error);
                        this.saveProcessing = false;
                    }
                )
            );
        else
            this.subscriptions.add(
                this.phieumuahangnccService.updatePhieuMuaHangNCC(phieumuahangncc_req).subscribe(
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
                        this.router.navigate(['/phieu-mua-hang-ncc']);
                        this.frmPhieuMuaHangNCC.instance.resetValues();
                        this.saveProcessing = false;
                    },
                    (error) => {
                        this.phieumuahangnccService.handleError(error);
                        this.saveProcessing = false;
                    }
                )
            );
        e.preventDefault();
    }
}
