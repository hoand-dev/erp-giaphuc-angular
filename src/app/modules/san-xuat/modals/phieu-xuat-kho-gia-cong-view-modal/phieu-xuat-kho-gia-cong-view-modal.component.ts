import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DonViGiaCong, KhachHang, KhoHang, PhieuXuatKhoGiaCong, PhieuXuatKhoGiaCong_ChiTiet } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    CommonService,
    DanhSachXeService,
    DonViGiaCongService,
    HangHoaService,
    KhachHangService,
    KhoHangService,
    PhieuXuatKhoGiaCongService,
    RouteInterceptorService,
    TaiXeService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-xuat-kho-gia-cong-view-modal',
    templateUrl: './phieu-xuat-kho-gia-cong-view-modal.component.html',
    styleUrls: ['./phieu-xuat-kho-gia-cong-view-modal.component.css']
})
export class PhieuXuatKhoGiaCongViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;
    private currentChiNhanh: ChiNhanh;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuxuatkhogiacong_id: number;

    /* thông tin copy */
    public phieuxuatkhogiacong: PhieuXuatKhoGiaCong;
    public lstKhachHang: KhachHang[] = [];
    public lstTaiXe: TaiXe[] = [];
    public lstXe: DanhSachXe[] = [];
    public lstDonViGiaCong: DonViGiaCong[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public dataSource_TaiXe: DataSource;
    public dataSource_Xe: DataSource;
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatKhoGiaCong_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,

        private phieuxuatkhogiacongService: PhieuXuatKhoGiaCongService,
        private khachhangService: KhachHangService,
        private taixeService: TaiXeService,
        private xeService: DanhSachXeService,
        private donvigiacongService: DonViGiaCongService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,

        private activatedRoute: ActivatedRoute,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoXuat = x;

                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );

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

        this.loadingVisible = true;
        this.subscriptions.add(
            this.taixeService.findTaiXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstTaiXe = x;

                this.dataSource_TaiXe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.xeService.findDanhSachXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstXe = x;

                this.dataSource_Xe = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuxuatkhogiacong.khoxuat_id, null, loadOptions)
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
                this.phieuxuatkhogiacongService.findPhieuXuatKhoGiaCong(this.phieuxuatkhogiacong_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuxuatkhogiacong_chitiets.length;

                        this.phieuxuatkhogiacong = data;
                        this.hanghoas = this.phieuxuatkhogiacong.phieuxuatkhogiacong_chitiets;
                    },
                    (error) => {
                        this.phieuxuatkhogiacongService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            // xem lịch sử xử lý sau
        }
    }
    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
        } else {
            this.hanghoas[index].khoxuat_id = this.phieuxuatkhogiacong.khoxuat_id;
            this.hanghoas[index].khogiacong_id = this.phieuxuatkhogiacong.khogiacong_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;
        }
        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            //this.onHangHoaAdd();
        }
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
