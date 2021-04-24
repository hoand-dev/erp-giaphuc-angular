import { ChiNhanh, PhieuNhapMuonHang, PhieuNhapMuonHang_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, ChiNhanhService, CommonService, KhoHangService, LichSuService, PhieuNhapMuonHangService, PhieuNhapTraMuonHangService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-phieu-nhap-muon-view-modal',
    templateUrl: './phieu-nhap-muon-view-modal.component.html',
    styleUrls: ['./phieu-nhap-muon-view-modal.component.css']
})
export class PhieuNhapMuonViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieunhapmuonhang_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieunhapmuonhang: PhieuNhapMuonHang;
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public lstKhoXuat: KhoHang[] = [];
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapMuonHang_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,
        private lichsuService: LichSuService,
        private phieunhaptramuonhangService: PhieuNhapTraMuonHangService,
        private activatedRoute: ActivatedRoute,
        private phieunhapmuonhangService: PhieuNhapMuonHangService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhapmuonhang = new PhieuNhapMuonHang();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.phieunhapmuonhang.chinhanh_id = x.id;

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

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieunhapmuonhangService.findPhieuNhapMuonHang(this.phieunhapmuonhang_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieunhapmuonhang_chitiets.length;

                        this.phieunhapmuonhang = data;
                        this.hanghoas = this.phieunhapmuonhang.phieunhapmuonhang_chitiets;
                    },
                    (error) => {
                        this.phieunhapmuonhangService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findNhapMuonHang(this.phieunhapmuonhang_id).subscribe(
                    (data) => {
                        this.hanghoalenght = data.phieunhapmuonhang_chitiets.length;

                        this.phieunhapmuonhang = data;
                        this.hanghoas = this.phieunhapmuonhang.phieunhapmuonhang_chitiets;
                    },
                    (error) => {
                        this.lichsuService.handleError(error);
                    }
                )
            );
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
            this.hanghoas[index].khonhap_id = this.phieunhapmuonhang.khonhap_id;
            this.hanghoas[index].mahanghoa = selected.mahanghoa;

            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
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
            // this.onHangHoaAdd();
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
