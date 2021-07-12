import { ChiNhanh, PhieuXuatTraMuonHang, PhieuXuatTraMuonHang_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, ChiNhanhService, CommonService, KhoHangService, PhieuXuatTraMuonHangService, PhieuNhapMuonHangService, RouteInterceptorService, LichSuService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhoHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import CustomStore from 'devextreme/data/custom_store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DanhSachPhieuNhapMuonHangModalComponent } from '../../modals/danh-sach-phieu-nhap-muon-hang-modal/danh-sach-phieu-nhap-muon-hang-modal.component';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';

@Component({
    selector: 'app-phieu-xuat-tra-view-modal',
    templateUrl: './phieu-xuat-tra-view-modal.component.html',
    styleUrls: ['./phieu-xuat-tra-view-modal.component.css']
})
export class PhieuXuatTraViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuxuattramuonhang_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieuxuattramuonhang: PhieuXuatTraMuonHang;
    public lstKhoXuat: KhoHang[] = [];
    public dataSource_KhoXuat: DataSource;

    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatTraMuonHang_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,
        private lichsuService: LichSuService,
        private phieuxuattramuonhangService: PhieuXuatTraMuonHangService,
        private activatedRoute: ActivatedRoute,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuxuattramuonhang = new PhieuXuatTraMuonHang();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.phieuxuattramuonhang.chinhanh_id = x.id;

                // tất cả kho, sau đó lọc lại theo điều kiện
                this.subscriptions.add(
                    this.khohangService.findKhoHangs().subscribe((x) => {
                        this.loadingVisible = false;

                        this.lstKhoXuat = x.filter((z) => z.chinhanh_id == this.currentChiNhanh.id && z.khongoai != true);
                        this.dataSource_KhoXuat = new DataSource({
                            store: this.lstKhoXuat,
                            paginate: true,
                            pageSize: 50
                        });

                        this.lstKhoNhap = x.filter((z) => z.chinhanh_id != this.currentChiNhanh.id || z.khongoai == true);
                        this.dataSource_KhoNhap = new DataSource({
                            store: this.lstKhoNhap,
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuxuattramuonhang.khoxuat_id, null, loadOptions)
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
                this.phieuxuattramuonhangService.findPhieuXuatTraMuonHang(this.phieuxuattramuonhang_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuxuattramuonhang_chitiets.length;

                        this.phieuxuattramuonhang = data;
                        this.hanghoas = this.phieuxuattramuonhang.phieuxuattramuonhang_chitiets;
                    },
                    (error) => {
                        this.phieuxuattramuonhangService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findXuatTraMuonHang(this.phieuxuattramuonhang_id).subscribe(
                    (data) => {
                        this.hanghoalenght = data.phieuxuattramuonhang_chitiets.length;

                        this.phieuxuattramuonhang = data;
                        this.hanghoas = this.phieuxuattramuonhang.phieuxuattramuonhang_chitiets;
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
            this.hanghoas[index].khoxuat_id = this.phieuxuattramuonhang.khoxuat_id;
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
