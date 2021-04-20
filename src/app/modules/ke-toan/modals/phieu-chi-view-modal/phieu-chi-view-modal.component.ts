import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, DonViGiaCong, KhachHang, NhaCungCap, NhaCungCap_SoTaiKhoan, PhieuChi, PhieuChi_PhieuNhapKho } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, KhachHangService, LichSuService, NhaCungCapService, NoiDungThuChiService, PhieuChiService, QuyTaiKhoanService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-chi-view-modal',
    templateUrl: './phieu-chi-view-modal.component.html',
    styleUrls: ['./phieu-chi-view-modal.component.css']
})
export class PhieuChiViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuchi_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;
    public phieuchi: PhieuChi;
    public loaiphieuchi: string = null;

    public lstKhachHang: KhachHang[] = [];
    public lstNhaCungCap: NhaCungCap[] = [];
    public lstDonViGiaCong: DonViGiaCong[] = [];

    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_DonViGiaCong: DataSource;
    public dataSource_QuyTaiKhoan: DataSource;
    public dataSource_NoiDungThuChi: DataSource;
    public lstSoTaiKhoan: NhaCungCap_SoTaiKhoan[] = [];

    public saveProcessing = false;
    public loadingVisible = true;

    public isLoadLanDau: boolean = false;

    public phieunhapkhos: PhieuChi_PhieuNhapKho[] = [];
    public dataSource_SoTaiKhoan: DataSource;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieuchiService: PhieuChiService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private donvigiacongService: DonViGiaCongService,
        private quytaikhoanService: QuyTaiKhoanService,
        private noidungthuchiService: NoiDungThuChiService,
        private lichsuService: LichSuService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuchi = new PhieuChi();

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
            this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                this.lstDonViGiaCong = x;
                this.dataSource_DonViGiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.noidungthuchiService.findNoiDungThuChis('chi').subscribe((x) => {
                this.dataSource_NoiDungThuChi = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        // this.subscriptions.add(
        //     this.nhacungcapService.findNhaCungCap_SoTaiKhoans().subscribe((x) => {
        //         this.dataSource_SoTaiKhoan = new DataSource({
        //             store: x,
        //             paginate: true,
        //             pageSize: 50
        //         });
        //     })
        // );

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieuchiService.findPhieuChi(this.phieuchi_id).subscribe(
                    (data) => {
                        this.isLoadLanDau = true;
                        this.loaiphieuchi = data.loaiphieuchi;
                        this.phieuchi = data;
                        if (this.phieuchi.loaiphieuchi == 'lenhvay') {
                            // trước khi lưu sẽ tính lại
                            this.phieuchi.sotienchi = 0;
                        }
                        this.phieuchi.phieuchi_phieunhapkhos_old = this.phieuchi.phieuchi_phieunhapkhos;
                        this.phieunhapkhos = this.phieuchi.phieuchi_phieunhapkhos;
                    },
                    (error) => {
                        this.phieuchiService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findChi(this.phieuchi_id).subscribe(
                    (data) => {
                        this.isLoadLanDau = true;
                        this.loaiphieuchi = data.loaiphieuchi;
                        this.phieuchi = data;
                        if (this.phieuchi.loaiphieuchi == 'lenhvay') {
                            // trước khi lưu sẽ tính lại
                            this.phieuchi.sotienchi = 0;
                        }
                        this.phieuchi.phieuchi_phieunhapkhos_old = this.phieuchi.phieuchi_phieunhapkhos;
                        this.phieunhapkhos = this.phieuchi.phieuchi_phieunhapkhos;
                    },
                    (error) => {
                        this.lichsuService.handleError(error);
                    }
                )
            );
        }
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieuchi.khachhang_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    //this.onTinhNoConLai();
                })
            );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieuchi.nhacungcap_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    //this.onTinhNoConLai();
                })
            );
            // lấy danh sách số tài khoản
            this.subscriptions.add(
                this.nhacungcapService.findNhaCungCap_SoTaiKhoans(this.phieuchi.nhacungcap_id).subscribe((data) => {
                    this.dataSource_SoTaiKhoan = new DataSource({
                        store: data,
                        paginate: true,
                        pageSize: 50
                    });
                })
            );
        }

        if (e.dataField == 'donvigiacong_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.donViGiaCong_LoadNoCu(this.phieuchi.donvigiacong_id, this.currentChiNhanh.id, this.phieuchi.sort).subscribe((data) => {
                    this.phieuchi.nocu = data;
                    //this.onTinhNoConLai();
                })
            );
        }

        if (e.dataField == 'sotienchi_lenhvay' && e.value !== undefined && e.value !== null) {
            //this.onTinhNoConLai();
        }
        if (e.dataField == 'sotienchi_laixuat' && e.value !== undefined && e.value !== null) {
            //this.onTinhNoConLai();
        }
    }

    calculateNoConLai() {
        switch (this.loaiphieuchi) {
            case 'khac':
                this.phieuchi.nocu = null;
                return null;
                break;
            case 'lenhvay':
                this.phieuchi.nocu = null;
                return null;
                break;
            case 'muonhang':
                this.phieuchi.nocu = null;
                return null;
                break;
            case 'khachhang':
                return this.phieuchi.nocu + this.phieuchi.tongchi;
                break;
            case 'nhacungcap':
                return this.phieuchi.nocu - this.phieuchi.tongchi;
                break;
            case 'donvigiacong':
                return this.phieuchi.nocu - this.phieuchi.tongchi;
                break;
            default:
                return null;
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
