import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, KhachHang, KhoHang, NguoiDung, PhieuDatHang, PhieuDatHang_ChiTiet } from '@app/shared/entities';
import { AppInfoService, CommonService, HangHoaService, KhachHangService, KhoHangService, NguoiDungService, PhieuDatHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-phieu-dat-hang-them-moi',
  templateUrl: './phieu-dat-hang-them-moi.component.html',
  styleUrls: ['./phieu-dat-hang-them-moi.component.css']
})
export class PhieuDatHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuDatHang: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;


    public phieudathang: PhieuDatHang;
    public lstKhachHang: KhachHang[] = [];
    public lstNguoiDung: NguoiDung[] =[];
    public lstKhoHang: KhoHang[] =[];


    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuDatHang_ChiTiet[] = [];
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
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private phieudathangService: PhieuDatHangService,
        private khachhangService: KhachHangService,
        private hanghoaService: HangHoaService,
        private nguoidungService: NguoiDungService,
        private khohangService: KhoHangService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuDatHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    asyncValidation: Function;
    ngOnInit(): void {

        this.phieudathang = new PhieuDatHang();
        this.asyncValidation = this.checkGiuHang.bind(this);

        

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

        this.onHangHoaAdd();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ khách hàng
            this.phieudathang.khachhang_dienthoai = e.value ? e.value.sodienthoai : null;
            this.phieudathang.khachhang_diachi = e.value ? e.value.diachi : null;
            this.phieudathang.khachhang_hoten =e.value ? e.value.tenkhachhang : null;
            this.phieudathang.khoxuat_id =e .value ? e.value.tenkhohang :null;
            this.phieudathang.khachhang_id = e.value ? e.value.id : null;
            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieudathang.khachhang_id).subscribe((data) => {
                    this.phieudathang.nocu = data;
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
        
        
       // nếu thay đổi kho xuất -> set khoxuat_id cho hàng hoá
        if (e.dataField == 'khoxuat') {
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieudathang.khoxuat.id;
            });
        }

        // tính tổng tiền
        this.onTinhTong();
    }

    checkGiuHang(params) {
        if (params.value == true && (this.phieudathang.khoxuat == null)) { //có check
            return false;
        }
        else{
            this.phieudathang.khoxuat = this.phieudathang.khoxuat != null ? null : this.phieudathang.khoxuat;
        }
        return true;
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuDatHang_ChiTiet());
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
        this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

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
                    this.phieudathang.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieudathang.thuevat = 0;
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
        this.phieudathang.tongtienhang = tongtienhang;
        this.phieudathang.tongthanhtien =
            tongtienhang - tongtienhang * this.phieudathang.chietkhau + (tongtienhang - tongtienhang * this.phieudathang.chietkhau) * this.phieudathang.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieudathang_req = this.phieudathang;

        // gán lại dữ liệu
        phieudathang_req.chinhanh_id = this.currentChiNhanh.id;
        phieudathang_req.khachhang_id = this.phieudathang.khachhang.id;
        phieudathang_req.nhanviensale_id = this.phieudathang.nguoidung.id;
        phieudathang_req.khoxuat_id = this.phieudathang.khoxuat.id;
        phieudathang_req.phieudathang_chitiet = hanghoas;
      


        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieudathangService.addPhieuDatHang(phieudathang_req).subscribe(
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
                    this.router.navigate(['/phieu-dat-hang']);
                    this.frmPhieuDatHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieudathangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }

}
