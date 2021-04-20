import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, KhachHang, NhaCungCap, PhieuThu, PhieuThu_PhieuXuatKho } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, KhachHangService, LichSuService, NhaCungCapService, NoiDungThuChiService, PhieuThuService, QuyTaiKhoanService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-thu-view-modal',
    templateUrl: './phieu-thu-view-modal.component.html',
    styleUrls: ['./phieu-thu-view-modal.component.css']
})
export class PhieuThuViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuthu_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;
    public phieuthu: PhieuThu;
    public loaiphieuthu: string = null;

    public lstKhachHang: KhachHang[] = [];
    public lstNhaCungCap: NhaCungCap[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_QuyTaiKhoan: DataSource;
    public dataSource_NoiDungThuChi: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public isLoadLanDau: boolean = false;
    public phieuxuatkhos: PhieuThu_PhieuXuatKho[] = [];

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieuthuService: PhieuThuService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private quytaikhoanService: QuyTaiKhoanService,
        private noidungthuchiService: NoiDungThuChiService,
        private lichsuService: LichSuService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuthu = new PhieuThu();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.quytaikhoanService.findQuyTaiKhoans(x.id).subscribe((x) => {
                        this.dataSource_QuyTaiKhoan = new DataSource({
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
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.lstNhaCungCap = x;
                this.dataSource_NhaCungCap = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.noidungthuchiService.findNoiDungThuChis('thu').subscribe((x) => {
                this.dataSource_NoiDungThuChi = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieuthuService.findPhieuThu(this.phieuthu_id).subscribe(
                    (data) => {
                        this.isLoadLanDau = true;
                        this.loaiphieuthu = data.loaiphieuthu;
                        this.phieuthu = data;
                        this.phieuthu.phieuthu_phieuxuatkhos_old = this.phieuthu.phieuthu_phieuxuatkhos;
                        this.phieuxuatkhos = this.phieuthu.phieuthu_phieuxuatkhos;
                    },
                    (error) => {
                        this.phieuthuService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findThu(this.phieuthu_id).subscribe(
                    (data) => {
                        this.isLoadLanDau = true;
                        this.loaiphieuthu = data.loaiphieuthu;
                        this.phieuthu = data;
                        this.phieuthu.phieuthu_phieuxuatkhos_old = this.phieuthu.phieuthu_phieuxuatkhos;
                        this.phieuxuatkhos = this.phieuthu.phieuthu_phieuxuatkhos;
                    },
                    (error) => {
                        this.lichsuService.handleError(error);
                    }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    async onFormFieldChanged(e) {
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieuthu.khachhang_id, this.currentChiNhanh.id, this.phieuthu.sort).subscribe((data) => {
                    this.phieuthu.nocu = data;
                    //this.onTinhNoConLai();
                })
            );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieuthu.nhacungcap_id, this.currentChiNhanh.id, this.phieuthu.sort).subscribe((data) => {
                    this.phieuthu.nocu = data;
                    //this.onTinhNoConLai();
                })
            );
        }
    }

    calculateNoConLai() {
        switch (this.loaiphieuthu) {
            case 'khac':
                // ? nếu thu khác còn nợ = 0
                return 0;
                break;
            case 'khachhang':
                return this.phieuthu.nocu - this.phieuthu.tongthu;
                break;
            case 'nhacungcap':
                return this.phieuthu.nocu + this.phieuthu.tongthu;
                break;
            default:
                return 0;
        }
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
