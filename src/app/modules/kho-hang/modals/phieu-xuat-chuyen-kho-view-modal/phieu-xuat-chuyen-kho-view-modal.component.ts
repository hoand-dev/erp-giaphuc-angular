import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhoHang, NhaCungCap, PhieuNhapKho, PhieuNhapKho_ChiTiet, PhieuXuatChuyenKho, PhieuXuatChuyenKho_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, HangHoaService, KhoHangService, LichSuService, PhieuNhapKhoService, PhieuXuatChuyenKhoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-xuat-chuyen-kho-view-modal',
    templateUrl: './phieu-xuat-chuyen-kho-view-modal.component.html',
    styleUrls: ['./phieu-xuat-chuyen-kho-view-modal.component.css']
})
export class PhieuXuatChuyenKhoViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuxuatchuyenkho_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieuxuatchuyenkho: PhieuXuatChuyenKho;
    public lstKhoHang: KhoHang[] = [];
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatChuyenKho_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieunhapkhoService: PhieuNhapKhoService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,
        private lichsuService: LichSuService,
        private phieuxuatchuyenkhoService: PhieuXuatChuyenKhoService,
        private activatedRoute: ActivatedRoute,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuxuatchuyenkho = new PhieuXuatChuyenKho();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        // ? lấy danh sách kho hàng theo chi nhánh hiện tại
        this.loadingVisible = true;
        this.subscriptions.add(
            this.khohangService.findKhoHangs(this.currentChiNhanh.id).subscribe((x) => {
                this.loadingVisible = false;
                this.lstKhoHang = x;

                this.dataSource_KhoHang = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuxuatchuyenkho.khoxuatchuyen_id, null, loadOptions)
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
                this.phieuxuatchuyenkhoService.findPhieuXuatChuyenKho(this.phieuxuatchuyenkho_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuxuatchuyenkho_chitiets.length;

                        this.phieuxuatchuyenkho = data;
                        this.hanghoas = this.phieuxuatchuyenkho.phieuxuatchuyenkho_chitiets;
                    },
                    (error) => {
                        this.phieuxuatchuyenkhoService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findXuatChuyenKho(this.phieuxuatchuyenkho_id).subscribe(
                    (data) => {
                        this.hanghoalenght = data.phieuxuatchuyenkho_chitiets.length;

                        this.phieuxuatchuyenkho = data;
                        this.hanghoas = this.phieuxuatchuyenkho.phieuxuatchuyenkho_chitiets;
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
            this.hanghoas[index].khoxuatchuyen_id = this.phieuxuatchuyenkho.khoxuatchuyen_id;
            this.hanghoas[index].dvt_id = selected.dvt_id;

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
