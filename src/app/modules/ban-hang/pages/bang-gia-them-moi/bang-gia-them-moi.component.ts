import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BangGia, BangGia_ChiTiet, ChiNhanh, DanhMucNo, KhachHang, KhoHang } from '@app/shared/entities';
import { AppInfoService, BangGiaService, CommonService, DanhMucNoService, HangHoaService, KhachHangService, KhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bang-gia-them-moi',
  templateUrl: './bang-gia-them-moi.component.html',
  styleUrls: ['./bang-gia-them-moi.component.css']
})
export class BangGiaThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuDatHang: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public banggia: BangGia;

    public lstKhachHang: KhachHang[] = [];
    public lstDanhMucNo: DanhMucNo[] = [];
    public lstKhoHang: KhoHang[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_DanhMucNo: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_HangHoa: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: BangGia_ChiTiet[] = [];


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

        private banggiaService: BangGiaService,
        private khachhangService: KhachHangService,
        private danhmucnoService: DanhMucNoService,
        private khohangService: KhoHangService,

        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuDatHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.banggia = new BangGia();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

             })
        );

        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhachHang = x;

                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.danhmucnoService.findDanhMucNos().subscribe((x) => {
                this.loadingVisible = false;
                this.lstDanhMucNo = x;
                this.dataSource_DanhMucNo = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
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

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // nếu thay đổi khách hàng
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value != null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn khách hàng
            this.isValidForm = true;
            // gán lại thông tin điện thoại + địa chỉ
            let khachhang = this.lstKhachHang.find((o) => o.id == this.banggia.khachhang_id);
            this.banggia.tenkhachhang = khachhang.tenkhachhang;
                
        }

    
        
    }

    

    public onHangHoaAdd() {
        this.hanghoas.push(new BangGia_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        //this.hanghoas[index].hanghoa_id = selected.;
        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].dvt_id = selected.dvt_id;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

        this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        switch (col) {
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
        }

       
    }

    

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let banggia_req = this.banggia;

        // gán lại dữ liệu
        banggia_req.chinhanh_id = this.currentChiNhanh.id;
        banggia_req.banggia_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.banggiaService.addBangGia(banggia_req).subscribe(
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
                    this.router.navigate(['/bang-gia']);
                    this.frmPhieuDatHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.banggiaService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }

}