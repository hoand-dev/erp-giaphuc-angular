import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, PhieuCanTru, PhieuCanTru_PhieuNhapKho, PhieuCanTru_PhieuXuatKho } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, KhachHangService, LichSuService, NhaCungCapService, NoiDungThuChiService, PhieuCanTruService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-can-tru-view-modal',
    templateUrl: './phieu-can-tru-view-modal.component.html',
    styleUrls: ['./phieu-can-tru-view-modal.component.css']
})
export class PhieuCanTruViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieucantru_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieucantru: PhieuCanTru;
    public loaiphieucantru: string = null;

    public dataSource_KhachHang: DataSource;
    public dataSource_NhaCungCap: DataSource;
    public dataSource_DonViGiaCong: DataSource;

    public dataSource_NoiDungThuChi: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;
    public isPhanBoTien: boolean = true;

    public phieuxuatkhos: PhieuCanTru_PhieuXuatKho[] = [];
    public phieunhapkhos: PhieuCanTru_PhieuNhapKho[] = [];

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieucantruService: PhieuCanTruService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private donvigiacongService: DonViGiaCongService,
        private noidungcantruchiService: NoiDungThuChiService,
        private lichsuService: LichSuService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieucantru = new PhieuCanTru();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
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
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.dataSource_NhaCungCap = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.noidungcantruchiService.findNoiDungThuChis().subscribe((x) => {
                this.dataSource_NoiDungThuChi = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        if (this.isView == 'xemphieu') {
            this.subscriptions.add(
                this.phieucantruService.findPhieuCanTru(this.phieucantru_id).subscribe(
                    (data) => {
                        this.loaiphieucantru = data.loaicantru;
                        this.phieucantru = data;

                        this.phieucantru.khachhang_id = data.khachhang_id;

                        this.phieucantru.phieucantru_phieuxuatkhos_old = this.phieucantru.phieucantru_phieuxuatkhos;
                        this.phieuxuatkhos = this.phieucantru.phieucantru_phieuxuatkhos;
                        this.phieucantru.phieucantru_phieunhapkhos_old = this.phieucantru.phieucantru_phieunhapkhos;
                        this.phieunhapkhos = this.phieucantru.phieucantru_phieunhapkhos;
                    },
                    (error) => {
                        this.phieucantruService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findCanTru(this.phieucantru_id).subscribe(
                    (data) => {
                        this.loaiphieucantru = data.loaicantru;
                        this.phieucantru = data;

                        this.phieucantru.khachhang_id = data.khachhang_id;

                        this.phieucantru.phieucantru_phieuxuatkhos_old = this.phieucantru.phieucantru_phieuxuatkhos;
                        this.phieuxuatkhos = this.phieucantru.phieucantru_phieuxuatkhos;
                        this.phieucantru.phieucantru_phieunhapkhos_old = this.phieucantru.phieucantru_phieunhapkhos;
                        this.phieunhapkhos = this.phieucantru.phieucantru_phieunhapkhos;
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
                this.commonService.khachHang_LoadNoCu(this.phieucantru.khachhang_id, this.currentChiNhanh.id, this.phieucantru.sort).subscribe((data) => {
                    this.phieucantru.nocu_khachhang = data;
                    this.calculateChenhLech();
                })
            );

            // lấy danh sách phiếu xuất kho
            // this.subscriptions.add(
            //     this.phieucantruService.findPhieuXuatKhos(this.currentChiNhanh.id, this.phieucantru.khachhang_id, null).subscribe((data) => {
            //         this.phieuxuatkhos = data;
            //     })
            // );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieucantru.nhacungcap_id, this.currentChiNhanh.id, this.phieucantru.sort).subscribe((data) => {
                    this.phieucantru.nocu_nhacungcap = data;
                    this.calculateChenhLech();
                })
            );

            // lấy danh sách phiếu nhập kho
            // this.subscriptions.add(
            //     this.phieucantruService.findPhieuNhapKhos(this.currentChiNhanh.id, null, this.phieucantru.nhacungcap_id).subscribe((data) => {
            //         this.phieunhapkhos = data;
            //     })
            // );
        }

        if (e.dataField == 'donvigiacong_id' && e.value !== undefined && e.value !== null) {
            // load nợ củ
            this.subscriptions.add(
                this.commonService.donViGiaCong_LoadNoCu(this.phieucantru.donvigiacong_id, this.currentChiNhanh.id, this.phieucantru.sort).subscribe((data) => {
                    this.phieucantru.nocu_donvigiacong = data;
                    this.calculateChenhLech();
                })
            );
        }
    }

    calculateChenhLech(){
        if (this.loaiphieucantru == 'khachhang-nhacungcap') {
            this.phieucantru.nocu_chenhlech = this.phieucantru.nocu_khachhang - this.phieucantru.nocu_nhacungcap;
            if (this.phieucantru.nocu_khachhang < this.phieucantru.nocu_nhacungcap) {
                this.phieucantru.nocu_chenhlech *= -1;
            }
        }
        if (this.loaiphieucantru == 'khachhang-donvigiacong') {
            this.phieucantru.nocu_chenhlech = this.phieucantru.nocu_khachhang - this.phieucantru.nocu_donvigiacong;
            if (this.phieucantru.nocu_khachhang < this.phieucantru.nocu_donvigiacong) {
                this.phieucantru.nocu_chenhlech *= -1;
            }
        }
        if (this.loaiphieucantru == 'nhacungcap-donvigiacong') {
            this.phieucantru.nocu_chenhlech = this.phieucantru.nocu_nhacungcap - this.phieucantru.nocu_donvigiacong;
            if (this.phieucantru.nocu_nhacungcap < this.phieucantru.nocu_donvigiacong) {
                this.phieucantru.nocu_chenhlech *= -1;
            }
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
