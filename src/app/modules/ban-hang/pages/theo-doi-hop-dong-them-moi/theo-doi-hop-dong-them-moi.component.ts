import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhachHang, NguoiDung, NhomKhachHang, TheoDoiHopDong } from '@app/shared/entities';
import { KhachHangService, NguoiDungService, NhomKhachHangService, TheoDoiHopDongService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import DataSource from 'devextreme/data/data_source';



@Component({
  selector: 'app-theo-doi-hop-dong-them-moi',
  templateUrl: './theo-doi-hop-dong-them-moi.component.html',
  styleUrls: ['./theo-doi-hop-dong-them-moi.component.css']
})
export class TheoDoiHopDongThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmTheoDoiHopDong: DxFormComponent;

    /*tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public lstKhachHang: KhachHang[] = [];
    public lstNhomKhachHang: NhomKhachHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];

   public dataSource_KhachHang: DataSource;
    public dataSource_NhomKhachHang: DataSource;
    public dataSource_NguoiDung: DataSource;

    public hopdong: TheoDoiHopDong;
    
    public ngayky: Date;
    public ngayhethan: Date;
    public thoigianconlai: Date;


    public saveProcessing = false;
    public loadingVisible = true;

    public rules: Object = { 'X': /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private khachhangService: KhachHangService,
        private nhomkhachhangService: NhomKhachHangService,
        private theodoihopdongService: TheoDoiHopDongService,
        private nguoidungService: NguoiDungService
    ) {}

    ngAfterViewInit(): void {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        
        this.hopdong = new TheoDoiHopDong();
        this.theCallBackValid = this.theCallBackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        //khi thêm mới thay đổi chi nhánh thì load lại danh sách khách hàng
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
        this.subscriptions.add(
            this.nguoidungService.findNguoiDungs().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNguoiDung = x;
                this.dataSource_NguoiDung = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallBackValid(params) {
        return this.theodoihopdongService.checkExistHopDong(params.value);
    }

    public hieuluc(params){
        //formatDate(value: string | number | Date, format: string, locale: string): string
    }

    onSubmitForm(e) {
        if(!this.frmTheoDoiHopDong.instance.validate().isValid) return;

        let hopdong_req = this.hopdong;
        hopdong_req.chinhanh_id = this.currentChiNhanh.id;
        hopdong_req.khachhang_id = hopdong_req.khachhang_id;
 
        this.saveProcessing = true;
        this.subscriptions.add(
            this.theodoihopdongService.addHopDong(hopdong_req).subscribe(
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
                    this.router.navigate(['/theo-doi-hop-dong']);
                    this.frmTheoDoiHopDong.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.theodoihopdongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }

}
