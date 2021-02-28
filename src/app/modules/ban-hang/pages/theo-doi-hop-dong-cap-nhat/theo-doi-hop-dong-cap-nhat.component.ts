import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhachHang, NguoiDung, NhomKhachHang, TheoDoiHopDong } from '@app/shared/entities';
import { KhachHangService, NhomKhachHangService, TheoDoiHopDongService, NguoiDungService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'app-theo-doi-hop-dong-cap-nhat',
    templateUrl: './theo-doi-hop-dong-cap-nhat.component.html',
    styleUrls: ['./theo-doi-hop-dong-cap-nhat.component.css']
})
export class TheoDoiHopDongCapNhatComponent implements OnInit {
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

    public saveProcessing = false;
    public loadingVisible = true;

    public sohopdong_old: string;

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
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let hopdong_id = params.id;
                //lấy thông tin khách hàng
                if (hopdong_id) {
                    this.subscriptions.add(
                        this.theodoihopdongService.findHopDong(hopdong_id).subscribe(
                            (data) => {
                                this.hopdong = data;
                                this.sohopdong_old = this.hopdong.masohopdong;
                                // this.khachhang.loaikhachhang = this.khachhang.loaikhachhang == 2 true : false; -- khi nào cần xử lý loại khách hàng thì xử lý ở đây
                            },
                            (error) => {
                                this.theodoihopdongService.handleError(error);
                            }
                        )
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
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallBackValid(params) {
        return this.theodoihopdongService.checkExistHopDong(params.value, this.sohopdong_old);
    }

    onSubmitForm(e) {
        if(!this.frmTheoDoiHopDong.instance.validate().isValid) return;

        let hopdong_req = this.hopdong;
        hopdong_req.chinhanh_id = this.currentChiNhanh.id;

        hopdong_req.khachhang_id = hopdong_req.khachhang_id;
        hopdong_req.nhomkhachhang_id = hopdong_req.nhomkhachhang_id;
        hopdong_req.user_id = hopdong_req.user_id;
        
        //khachhang_req.loaikhachhang = this.khachhang_req.loaikhachhang_id ? 2 : 1
        //nếu muốn chi ra khách sỉ hay lẻ thì xử lý thêm chỗ này

        this.saveProcessing = true;
        this.subscriptions.add(
            this.theodoihopdongService.updateHopDong(hopdong_req).subscribe(
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
