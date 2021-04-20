import { ChiNhanh, PhieuNhapTraMuonHang, PhieuNhapTraMuonHang_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, ChiNhanhService, CommonService, KhoHangService, PhieuNhapTraMuonHangService, PhieuXuatMuonHangService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';

@Component({
    selector: 'app-phieu-nhap-tra-view-modal',
    templateUrl: './phieu-nhap-tra-view-modal.component.html',
    styleUrls: ['./phieu-nhap-tra-view-modal.component.css']
})
export class PhieuNhapTraViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieunhaptramuonhang_id: number;

    /* thông tin copy */
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

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,
        private phieunhaptramuonhangService: PhieuNhapTraMuonHangService,
        private activatedRoute: ActivatedRoute,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhaptramuonhang = new PhieuNhapTraMuonHang();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.phieunhaptramuonhang.chinhanh_id = x.id;

                // tất cả kho, sau đó lọc lại theo điều kiện
                this.subscriptions.add(
                    this.khohangService.findKhoHangs().subscribe((x) => {
                        this.loadingVisible = false;

                        this.lstKhoNhap = x.filter((z) => z.chinhanh_id == this.currentChiNhanh.id && z.khongoai != true);
                        this.dataSource_KhoNhap = new DataSource({
                            store: this.lstKhoNhap,
                            paginate: true,
                            pageSize: 50
                        });

                        this.lstKhoXuat = x.filter((z) => z.chinhanh_id != this.currentChiNhanh.id || z.khongoai == true);
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

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieunhaptramuonhangService.findPhieuNhapTraMuonHang(this.phieunhaptramuonhang_id).subscribe(
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
        } else if (this.isView == 'xemlichsu') {
            // xem lịch sử xử lý sau
        }
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
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            //  this.onHangHoaAdd();
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
