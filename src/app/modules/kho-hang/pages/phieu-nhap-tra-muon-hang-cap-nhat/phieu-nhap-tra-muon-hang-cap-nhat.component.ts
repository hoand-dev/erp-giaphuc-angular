import { ChiNhanh, PhieuNhapTraMuonHang, PhieuNhapTraMuonHang_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, ChiNhanhService, CommonService, KhoHangService, PhieuNhapTraMuonHangService, PhieuXuatMuonHangService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DanhSachPhieuXuatMuonHangModalComponent } from '../../modals/danh-sach-phieu-xuat-muon-hang-modal/danh-sach-phieu-xuat-muon-hang-modal.component';

@Component({
    selector: 'app-phieu-nhap-tra-muon-hang-cap-nhat',
    templateUrl: './phieu-nhap-tra-muon-hang-cap-nhat.component.html',
    styleUrls: ['./phieu-nhap-tra-muon-hang-cap-nhat.component.css']
})
export class PhieuNhapTraMuonHangCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuNhapTraMuonHang: DxFormComponent;
    bsModalRef: BsModalRef;
    
    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieunhaptramuonhang: PhieuNhapTraMuonHang;
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public lstKhoXuat: KhoHang[] = [];
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapTraMuonHang_ChiTiet[] = [];
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

        private phieunhaptramuonhangService: PhieuNhapTraMuonHangService,
        private phieuxuatmuonhangService: PhieuXuatMuonHangService,
        private chinhanhService: ChiNhanhService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuNhapTraMuonHang.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.phieunhaptramuonhang = new PhieuNhapTraMuonHang();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.phieunhaptramuonhang.chinhanh_id = x.id;

                // tất cả kho, sau đó lọc lại theo điều kiện
                this.subscriptions.add(
                    this.khohangService.findKhoHangs().subscribe((x) => {
                        this.loadingVisible = false;
                        
                        this.lstKhoNhap = x.filter(z => z.chinhanh_id == this.currentChiNhanh.id && z.khongoai != true);
                        this.dataSource_KhoNhap = new DataSource({
                            store: this.lstKhoNhap,
                            paginate: true,
                            pageSize: 50
                        });

                        this.lstKhoXuat = x.filter(z => z.chinhanh_id != this.currentChiNhanh.id || z.khongoai == true);
                        this.dataSource_KhoXuat = new DataSource({
                            store: this.lstKhoXuat,
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

        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieunhaptramuonhang_id = params.id;
                // lấy thông tin
                if (phieunhaptramuonhang_id) {
                    this.subscriptions.add(
                        this.phieunhaptramuonhangService.findPhieuNhapTraMuonHang(phieunhaptramuonhang_id).subscribe(
                            (data) => {
                                // gán độ dài danh sách hàng hóa load lần đầu
                                this.hanghoalenght = data.phieunhaptramuonhang_chitiets.length;
                                
                                this.phieunhaptramuonhang = data;
                                this.hanghoas = this.phieunhaptramuonhang.phieunhaptramuonhang_chitiets;
                            },
                            (error) => {
                                this.phieunhaptramuonhangService.handleError(error);
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
        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhaptramuonhang.khonhap_id;
            });
            //this.frmPhieuNhapTraMuonHang.instance.validate();
        }

        if (e.dataField == 'khonhap_id' && e.value !== undefined && e.value !== null) {
            this.frmPhieuNhapTraMuonHang.instance.validate();
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        //this.hanghoas.push(new PhieuNhapTraMuonHang_ChiTiet());
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
            this.hanghoas[index].khonhap_id = this.phieunhaptramuonhang.khonhap_id;
            this.hanghoas[index].mahanghoa = selected.mahanghoa;

            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            //this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            //this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
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
        // switch (col) {
        //     case 'soluong':
        //         this.hanghoas[index].soluong = e.value;
        //         break;
        //     case 'dongia':
        //         this.hanghoas[index].dongia = e.value;
        //         break;
        // }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        // let tongtienhang: number = 0;
        // this.hanghoas.forEach((v, i) => {
        //     v.thanhtien = v.soluong * v.dongia;
        //     tongtienhang += v.thanhtien;
        // });
        // this.phieunhaptramuonhang.tongthanhtien = tongtienhang;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null && x.soluong != 0);
        let phieunhaptramuonhang_req = this.phieunhaptramuonhang;

        // gán lại dữ liệu
        phieunhaptramuonhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieunhaptramuonhang_req.phieunhaptramuonhang_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieunhaptramuonhangService.updatePhieuNhapTraMuonHang(phieunhaptramuonhang_req).subscribe(
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
                    this.router.navigate(['/phieu-nhap-tra-muon-hang']);
                    this.frmPhieuNhapTraMuonHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieunhaptramuonhangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
