import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, KhachHang, KhoHang, NguoiDung, PhieuBanHang, PhieuBanHang_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    CommonService,
    HangHoaService,
    KhachHangService,
    KhoHangService,
    LichSuService,
    NguoiDungService,
    PhieuBanHangService,
    PhieuDatHangService,
    PhieuMuaHangNCCService,
    RouteInterceptorService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-ban-hang-view-modal',
    templateUrl: './phieu-ban-hang-view-modal.component.html',
    styleUrls: ['./phieu-ban-hang-view-modal.component.css']
})
export class PhieuBanHangViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieubanhang_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieubanhang: PhieuBanHang;
    public lstKhachHang: KhachHang[] = [];
    public lstKhoHang: KhoHang[] = [];
    public lstNguoiDung: NguoiDung[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_NguoiDung: DataSource;
    public dataSource_HangHoa: DataSource;

    public firstLoad_KhachHang = true;

    public hanghoas: PhieuBanHang_ChiTiet[] = [];

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public sumTotal: SumTotalPipe,
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
        private lichsuService: LichSuService,
        public bsModalRef: BsModalRef
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        /*thêm nội dung vào đây */

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                // ? lấy danh sách kho hàng theo chi nhánh hiện tại

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.lstKhoHang = x;
                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );

        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.lstKhachHang = x;
                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.nguoidungService.findNguoiDungs().subscribe((x) => {
                this.lstNguoiDung = x;
                this.dataSource_NguoiDung = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.dataSource_HangHoa = new DataSource({
            paginate: true,
            pageSize: 50,
            store: new CustomStore({
                key: 'id',
                load: (loadOptions) => {
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieubanhang.khoxuat_id, null, loadOptions)
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

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieubanhangService.findPhieuBanHang(this.phieubanhang_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieubanhang_chitiet.length;

                        this.phieubanhang = data;
                        this.hanghoas = this.phieubanhang.phieubanhang_chitiet;
                    },
                    (error) => {
                        this.phieubanhangService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findBanHang(this.phieubanhang_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieubanhang_chitiet.length;

                        this.phieubanhang = data;
                        this.hanghoas = this.phieubanhang.phieubanhang_chitiet;
                    },
                    (error) => {
                        this.lichsuService.handleError(error);
                    }
                )
            );
        }
    }

    onCheckVAT() {
        if (this.hanghoalenght == 0) {
            this.hanghoas.forEach((v, i) => {
                if (v.thuevat != 0 || this.phieubanhang.thuevat != 0) v.xuathoadon = true;
                else v.xuathoadon = false;
            });
        }
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            //return;
        } else {
            this.onCheckVAT();
            this.hanghoas[index].khoxuat_id = this.phieubanhang.khoxuat_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tenhanghoa_inphieu = selected.tenhanghoa;

            this.hanghoas[index].dongia = 0;
            this.commonService
                .hangHoa_LayGia_XuatKho(this.phieubanhang.khachhang_id, selected.id)
                .toPromise()
                .then((data) => {
                    this.hanghoas[index].dongia = data ? data : 0;
                    this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
                });
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onConfirm(item): void {
        this.onClose.next(item);
        this.bsModalRef.hide();
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
