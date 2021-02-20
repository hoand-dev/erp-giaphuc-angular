import { ChiNhanh, BangGiaGiaCong, BangGiaGiaCong_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, DonViGiaCongService, BangGiaGiaCongService, RouteInterceptorService, DanhMucTieuChuanService, DanhMucGiaCongService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { DonViGiaCong } from '@app/shared/entities';

@Component({
    selector: 'app-bang-gia-gia-cong-them-moi',
    templateUrl: './bang-gia-gia-cong-them-moi.component.html',
    styleUrls: ['./bang-gia-gia-cong-them-moi.component.css']
})
export class BangGiaGiaCongThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmBangGiaGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public banggiagiacong: BangGiaGiaCong;

    public lstDonViGiaCong: DonViGiaCong[] = [];
    public dataSource_DonViGiaCong: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public chitiets: BangGiaGiaCong_ChiTiet[] = [];
    public dataSource_DanhMucGiaCong: any = {};
    public dataSource_TieuChuan: any = {};

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

        private banggiagiacongService: BangGiaGiaCongService,
        private donvigiacongService: DonViGiaCongService,
        private danhmucgiacongService: DanhMucGiaCongService,
        private tieuchuanService: DanhMucTieuChuanService,
    ) {}

    ngAfterViewInit() {
        // this.frmBangGiaGiaCong.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.banggiagiacong = new BangGiaGiaCong();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstDonViGiaCong = x;
        
                        this.dataSource_DonViGiaCong = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        this.subscriptions.add(
            this.danhmucgiacongService.findDanhMucGiaCongs().subscribe((x) => {
                this.loadingVisible = false;

                this.dataSource_DanhMucGiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.tieuchuanService.findDanhMucTieuChuans().subscribe((x) => {
                this.loadingVisible = false;

                this.dataSource_TieuChuan = new DataSource({
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

    public onHangHoaAdd() {
        this.chitiets.push(new BangGiaGiaCong_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.chitiets = this.chitiets.filter(function (i) {
            return i !== item;
        });
    }

    public onHangHoaChanged(index, e) {
        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.chitiets.filter((x) => x.danhmucgiacong_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    public onValidation(){
        let checkgiacong = this.chitiets.filter((x) => x.danhmucgiacong_id != null && x.tieuchuan_id == null).length;
        let checktieuchuan = this.chitiets.filter((x) => x.danhmucgiacong_id == null && x.tieuchuan_id != null).length;

        if(checkgiacong > 0){
            notify(
                {
                    width: 320,
                    message: 'Vui lòng chọn "tiêu chuẩn" cho gia công',
                    position: { my: 'right top', at: 'right top' }
                },
                'warning',
                475
            );
            return false;
        }

        if(checktieuchuan > 0){
            notify(
                {
                    width: 320,
                    message: 'Vui lòng chọn "gia công" cho tiêu chuẩn',
                    position: { my: 'right top', at: 'right top' }
                },
                'warning',
                475
            );
            return false;
        }

        return true;
    }

    public onSubmitForm(e) {
        if(!this.onValidation()) return;

        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let chitiets = this.chitiets.filter((x) => x.danhmucgiacong_id != null && x.tieuchuan_id != null);
        let banggiagiacong_req = this.banggiagiacong;

        // gán lại dữ liệu
        banggiagiacong_req.chinhanh_id = this.currentChiNhanh.id;
        banggiagiacong_req.banggiagiacong_chitiets = chitiets;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.banggiagiacongService.addBangGiaGiaCong(banggiagiacong_req).subscribe(
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
                    this.router.navigate(['/bang-gia-gia-cong']);
                    this.frmBangGiaGiaCong.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.banggiagiacongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
