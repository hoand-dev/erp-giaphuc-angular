import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhuVuc, NhomKhachHang, KhachHang } from '@app/shared/entities';
import { KhachHangService, NhomKhachHangService, KhuVucService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-khach-hang-them-moi',
    templateUrl: './khach-hang-them-moi.component.html',
    styleUrls: ['./khach-hang-them-moi.component.css']
})
export class KhachHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmKhachHang: DxFormComponent;

    /*tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public lstKhuVuc: KhuVuc[] = [];
    public lstNhomKhachHang: NhomKhachHang[] = [];

    public dataSource_KhuVuc: DataSource;
    public dataSource_NhomKhachHang: DataSource;

    public khachhang: KhachHang;

    public saveProcessing = false;
    public loadingVisible = true;

    public rules: Object = { X: /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private khachhangService: KhachHangService,
        private nhomkhachhangService: NhomKhachHangService,
        private khuvucService: KhuVucService
    ) {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        this.khachhang = new KhachHang();
        this.theCallBackValid = this.theCallBackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(
            this.khuvucService.findKhuVucs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhuVuc = x;
                this.dataSource_KhuVuc = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.nhomkhachhangService.findNhomKhachHangs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNhomKhachHang = x;
                this.dataSource_NhomKhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    theCallBackValid(params) {
        return this.khachhangService.checkExistKhachHang(params.value);
    }

    onSubmitForm(e) {
        let khachhang_req = this.khachhang;
        khachhang_req.chinhanh_id = this.currentChiNhanh.id;

        //khachhang_req.loaikhachhang = this.khachhang_req.loaikhachhang_id ? 2 : 1
        //nếu muốn chi ra khách sỉ hay lẻ thì xử lý thêm chỗ này
        // gán lại dữ liệu
        
        khachhang_req.nhomkhachhang_id = khachhang_req.nhomkhachhang_id;
        khachhang_req.khuvuc_id = khachhang_req.khuvuc_id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.khachhangService.addKhachHang(khachhang_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: ' Lưu thành công',
                            position: { my: 'right top', at: ' right top' }
                        },
                        'sucess',
                        475
                    );
                    this.router.navigate(['/khach-hang']);
                    this.frmKhachHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.khachhangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
