import { ChiNhanh, PhieuCanTru, PhieuCanTru_PhieuNhapKho, PhieuCanTru_PhieuXuatKho } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import {
    AppInfoService,
    CommonService,
    DonViGiaCongService,
    KhachHangService,
    NhaCungCapService,
    NoiDungThuChiService,
    PhieuCanTruService,
    RouteInterceptorService
} from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-phieu-can-tru-them-moi',
    templateUrl: './phieu-can-tru-them-moi.component.html',
    styleUrls: ['./phieu-can-tru-them-moi.component.css']
})
export class PhieuCanTruThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuCanTru: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
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

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private commonService: CommonService,
        private routeInterceptorService: RouteInterceptorService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,

        private phieucantruService: PhieuCanTruService,
        private khachhangService: KhachHangService,
        private nhacungcapService: NhaCungCapService,
        private donvigiacongService: DonViGiaCongService,
        private noidungcantruchiService: NoiDungThuChiService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuCanTru.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
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

        // kiểm tra có cantruộc các loại phiếu cantru này hay không?
        let arrLoaiPhieuCanTru: string[] = ['khachhang-nhacungcap', 'khachhang-donvigiacong', 'nhacungcap-donvigiacong'];

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.loaiphieucantru) && arrLoaiPhieuCanTru.includes(params.loaiphieucantru)) {
                    this.loaiphieucantru = params.loaiphieucantru;
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'khachhang_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.khachHang_LoadNoCu(this.phieucantru.khachhang_id, this.currentChiNhanh.id, this.phieucantru.sort).subscribe((data) => {
                    this.phieucantru.nocu_khachhang = data;
                })
            );

            // lấy danh sách phiếu xuất kho
            this.subscriptions.add(
                this.phieucantruService.findPhieuXuatKhos(this.currentChiNhanh.id, this.phieucantru.khachhang_id, null).subscribe((data) => {
                    this.phieuxuatkhos = data;
                })
            );
        }

        if (e.dataField == 'nhacungcap_id' && e.value !== undefined && e.value !== null) {
            // lấy nợ cũ
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieucantru.nhacungcap_id, this.currentChiNhanh.id, this.phieucantru.sort).subscribe((data) => {
                    this.phieucantru.nocu_nhacungcap = data;
                })
            );

            // lấy danh sách phiếu nhập kho
            this.subscriptions.add(
                this.phieucantruService.findPhieuNhapKhos(this.currentChiNhanh.id, null, this.phieucantru.nhacungcap_id).subscribe((data) => {
                    this.phieunhapkhos = data;
                })
            );
        }

        if (e.dataField == 'donvigiacong_id' && e.value !== undefined && e.value !== null) {
            // load nợ củ
        }

        if (e.dataField == 'sotiencantru' && e.value !== undefined && e.value !== null) {
            // phân bổ tiền
            if (this.isPhanBoTien) {
                let sotienphanbo_xuatkho = this.phieucantru.sotiencantru;
                this.phieuxuatkhos.forEach((v, i) => {
                    if (sotienphanbo_xuatkho > 0) {
                        let tiencancantru = v.tongthanhtien - v.sotienthutruoc;
                        if (sotienphanbo_xuatkho > tiencancantru) {
                            v.sotienthu = tiencancantru;
                        }
                        if (sotienphanbo_xuatkho <= tiencancantru) {
                            v.sotienthu = sotienphanbo_xuatkho;
                        }
                        sotienphanbo_xuatkho -= v.sotienthu;
                    } else v.sotienthu = 0;
                });

                let sotienphanbo_nhapkho = this.phieucantru.sotiencantru;
                this.phieunhapkhos.forEach((v, i) => {
                    if (sotienphanbo_nhapkho > 0) {
                        let tiencancantru = v.tongthanhtien - v.sotienchitruoc;
                        if (sotienphanbo_nhapkho > tiencancantru) {
                            v.sotienchi = tiencancantru;
                        }
                        if (sotienphanbo_nhapkho <= tiencancantru) {
                            v.sotienchi = sotienphanbo_nhapkho;
                        }
                        sotienphanbo_nhapkho -= v.sotienchi;
                    } else v.sotienchi = 0;
                });
            }
        }

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

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        // this.isPhanBoTien = false;

        // let tongcantru = 0;
        // this.phieuxuatkhos.forEach((v, i) => {
        //     tongcantru += v.sotienthu;
        // });
        // this.phieucantru.sotiencantru = tongcantru;

        // // đặt time out 1s tránh được nó tự phân bổ, js bất đồng bộ
        // setTimeout(() => {
        //     this.isPhanBoTien = true;
        // }, 1000);
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu số tiền cantru = 0 và số tiền giảm = 0
        let phieucantru_phieuxuatkhos = this.phieuxuatkhos.filter((x) => x.sotienthu != 0);
        let phieucantru_phieunhapkhos = this.phieunhapkhos.filter((x) => x.sotienchi != 0);
        let phieucantru_req = this.phieucantru;

        // gán lại dữ liệu
        phieucantru_req.chinhanh_id = this.currentChiNhanh.id;
        phieucantru_req.loaicantru = this.loaiphieucantru;
        phieucantru_req.phieucantru_phieuxuatkhos = phieucantru_phieuxuatkhos;
        phieucantru_req.phieucantru_phieunhapkhos = phieucantru_phieunhapkhos;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieucantruService.addPhieuCanTru(phieucantru_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: 'Lưu thành công',
                            position: { my: 'right top', at: 'right top' }
                        },
                        'success',
                        475
                    );
                    this.router.navigate(['/phieu-can-tru']);
                    this.frmPhieuCanTru.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieucantruService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
