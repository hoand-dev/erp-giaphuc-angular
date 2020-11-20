import { ChiNhanh, PhieuDatHangNCC, PhieuDatHangNCC_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, NhaCungCapService, PhieuDatHangNCCService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { NhaCungCap } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';

@Component({
    selector: 'app-phieu-dat-hang-ncc-them-moi',
    templateUrl: './phieu-dat-hang-ncc-them-moi.component.html',
    styleUrls: ['./phieu-dat-hang-ncc-them-moi.component.css']
})
export class PhieuDatHangNCCThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuDatHangNCC: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieudathangncc: PhieuDatHangNCC;
    public lstNhaCungCap: NhaCungCap[] = [];

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuDatHangNCC_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private phieudathangnccService: PhieuDatHangNCCService,
        private nhacungcapService: NhaCungCapService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuDatHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.phieudathangncc = new PhieuDatHangNCC();

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNhaCungCap = x;
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

        this.onHangHoaAdd();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'nhacungcap') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ nhà cung cấp
            this.phieudathangncc.dienthoainhacungcap = e.value ? e.value.sodienthoai : null;
            this.phieudathangncc.diachinhacungcap = e.value ? e.value.diachi : null;
            this.phieudathangncc.nhacungcap_id = e.value ? e.value.id : null;

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieudathangncc.nhacungcap_id).subscribe((data) => {
                    this.phieudathangncc.nocu = data;
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
        this.onTinhTong();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuDatHangNCC_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].dvt_id = selected.dvt_id;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

        this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
        this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;

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
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieudathangncc.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieudathangncc.thuevat = 0;
                }
                break;
        }

        this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        this.hanghoas[index].thanhtien =
            this.hanghoas[index].thanhtien -
            this.hanghoas[index].thanhtien * this.hanghoas[index].chietkhau +
            (this.hanghoas[index].thanhtien - this.hanghoas[index].thanhtien * this.hanghoas[index].chietkhau) * this.hanghoas[index].thuevat;

        // tính tổng tiền sau chiết khấu
        this.onTinhTong();
    }

    // tính tổng tiền hàng và tổng thành tiền sau chiết khấu
    private onTinhTong() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            tongtienhang += v.thanhtien;
        });
        this.phieudathangncc.tongtienhang = tongtienhang;
        this.phieudathangncc.tongthanhtien =
            tongtienhang - tongtienhang * this.phieudathangncc.chietkhau + (tongtienhang - tongtienhang * this.phieudathangncc.chietkhau) * this.phieudathangncc.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieudathangncc_req = this.phieudathangncc;

        // gán lại dữ liệu
        phieudathangncc_req.chinhanh_id = this.currentChiNhanh.id;
        phieudathangncc_req.nhacungcap_id = phieudathangncc_req.nhacungcap.id;

        phieudathangncc_req.phieudathangncc_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieudathangnccService.addPhieuDatHangNCC(phieudathangncc_req).subscribe(
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
                    this.router.navigate(['/phieu-dat-hang-ncc']);
                    this.frmPhieuDatHangNCC.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieudathangnccService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
