import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, KhachHang, KhoHang, NguoiDung, PhieuBanHang, PhieuBanHang_ChiTiet, PhieuDatHang, PhieuDatHang_ChiTiet } from '@app/shared/entities';
import { AppInfoService, CommonService, HangHoaService, KhachHangService, KhoHangService, NguoiDungService, PhieuBanHangService, PhieuDatHangService, RouteInterceptorService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DanhSachPhieuDatHangModalComponent } from '../../modals/danh-sach-phieu-dat-hang-modal/danh-sach-phieu-dat-hang-modal.component';

@Component({
  selector: 'app-phieu-ban-hang-them-moi',
  templateUrl: './phieu-ban-hang-them-moi.component.html',
  styleUrls: ['./phieu-ban-hang-them-moi.component.css']
})
export class PhieuBanHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, {static: false}) frmPhieuBanHang : DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */

    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieubanhang: PhieuBanHang;
    public phieudathang: PhieuDatHang;
    public lstKhachHang: KhachHang [] = [];
    public lstKhoHang: KhoHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];

    public hanghoas: PhieuBanHang_ChiTiet [] = [];
    public dataSource_HangHoa: any = {};
    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    
    public saveProcessing = false;
    public loadingVisible = true;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu đặt hàng
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

        private phieubanhangService: PhieuBanHangService,
        private objPhieuDatHangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        private nguoidungService: NguoiDungService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmphieubanhang.instance.validate(); // showValidationSummary sau khi focus out
    }
    
    ngOnInit(): void {
        this.phieubanhang = new PhieuBanHang();
       
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                // ? lấy danh sách kho hàng theo chi nhánh hiện tại
                this.loadingVisible = true;
                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoHang = x;
                    })
                );
            })
        );
        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhachHang = x;
            })
        );
        this.subscriptions.add(
            this.nguoidungService.findNguoiDungs().subscribe(
                x => {
                this.loadingVisible = false;
                this.lstNguoiDung = x;
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

        // console.log(this.routeInterceptorService.previousUrl);

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tuphieu)) {
                    this.hanghoas = [];
                    // lấy thông tin phiếu đặt hàng ncc từ api
                    this.objPhieuDatHangService.findPhieuDatHang(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            /* phiếu đặt hàng -> phiếu bán hàng*/
                            // xử lý phần thông tin phiếu
                            this.phieubanhang.khachhang_id = data.khachhang_id;
                            this.phieubanhang.tongtienhang = data.tongtienhang;
                            this.phieubanhang.thuevat = data.thuevat;
                            this.phieubanhang.chietkhau = data.chietkhau;
                            this.phieubanhang.tongthanhtien = data.tongthanhtien;
                            this.phieubanhang.phieudathang_id = data.id;
                            this.phieubanhang.maphieudathang = data.maphieudathang;
                            this.phieubanhang.nhanviensale_id = data.nhanviensale_id;
                            this.phieubanhang.khoxuat_id = data.khoxuat_id;

                            /*lấy các thông tin từ phiếu củ */

                            this.phieubanhang.khachhang = this.lstKhachHang.find((x) => x.id == data.khachhang_id);
                            this.phieubanhang.khoxuat = this.lstKhoHang.find((x) => x.id == data.khoxuat_id);
                            this.phieubanhang.nguoidung = this.lstNguoiDung.find((x) => x.id == data.nhanviensale_id);

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieudathang_chitiet.length;
                            
                            // xử lý phần thông tin chi tiết phiếu
                            data.phieudathang_chitiet.forEach((value, index) => {
                                let item = new PhieuBanHang_ChiTiet();
                                
                                item.loaihanghoa = value.loaihanghoa;
                                item.hanghoa_id = value.hanghoa_id;
                                item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                item.dvt_id = value.dvt_id;
                                item.tilequydoi = value.tilequydoi;
                                item.soluong = value.soluong - value.soluongdagiao;
                                item.dongia = value.dongia;
                                item.thuevat = value.thuevat;
                                item.chietkhau = value.chietkhau;
                                item.thanhtien = value.thanhtien;
                                item.chuthich = value.chuthich;
                                item.tenhanghoa_inphieu = value.tenhanghoa_inphieu;
                                item.phieudathang_chitiet_id = value.id;

                                this.hanghoas.push(item);
                            });
                        },
                        (error) => {
                            this.phieubanhangService.handleError(error);
                        }
                    );
                }
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

    openModal() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH PHIẾU ĐẶT HÀNG' // và nhiều hơn thế nữa
        };
        
        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuDatHangModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-ban-hang/them-moi`], { queryParams: { tuphieu: result.id } });
        });
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            this.phieubanhang.khachhang_dienthoai = e.value ? e.value.sodienthoai : null;
            this.phieubanhang.khachhang_diachi = e.value ? e.value.diachi : null;
            this.phieubanhang.khachhang_hoten = e.value ? e.value.tenkhachhang : null;
            //this.phieubanhang.khoxuat_id =  e .value ? e.value.tenkhohang :null;
            this.phieubanhang.khachhang_id = e.value ? e.value.id : null;

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieubanhang.khachhang_id, this.phieubanhang.sort).subscribe((data) => {
                    this.phieubanhang.nocu = data;
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
        this.hanghoas.push(new PhieuBanHang_ChiTiet());
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
            this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
            this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

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
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieubanhang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieubanhang.thuevat = 0;
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
        this.phieubanhang.tongtienhang = tongtienhang;
        this.phieubanhang.tongthanhtien =
            tongtienhang - tongtienhang * this.phieubanhang.chietkhau + (tongtienhang - tongtienhang * this.phieubanhang.chietkhau) * this.phieubanhang.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieubanhang_req = this.phieubanhang;

        // gán lại dữ liệu
        phieubanhang_req.chinhanh_id = this.currentChiNhanh.id;
        phieubanhang_req.khachhang_id = this.phieubanhang.khachhang.id;
        phieubanhang_req.nhanviensale_id = this.phieubanhang.nguoidung.id;
        phieubanhang_req.khoxuat_id = this.phieubanhang.khoxuat.id;
        phieubanhang_req.phieubanhang_chitiet = hanghoas;
       

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieubanhangService.addPhieuBanHang(phieubanhang_req).subscribe(
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
                    this.router.navigate(['/phieu-ban-hang']);
                    this.frmPhieuBanHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieubanhangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}