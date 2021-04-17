import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, KhoHang, NhaCungCap, PhieuNhapKho, PhieuNhapKho_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, HangHoaService, KhoHangService, PhieuNhapKhoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-nhap-kho-view-modal',
    templateUrl: './phieu-nhap-kho-view-modal.component.html',
    styleUrls: ['./phieu-nhap-kho-view-modal.component.css']
})
export class PhieuNhapKhoViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieunhapkho_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieunhapkho: PhieuNhapKho;
    public lstNhaCungCap: NhaCungCap[] = [];
    public lstKhoNhap: KhoHang[] = [];
    public dataSource_KhoNhap: DataSource;

    public hanghoas: PhieuNhapKho_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieunhapkhoService: PhieuNhapKhoService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhapkho = new PhieuNhapKho();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        // ? lấy danh sách kho hàng theo chi nhánh hiện tại
        this.subscriptions.add(
            this.khohangService.findKhoHangs(this.currentChiNhanh.id).subscribe((x) => {
                this.lstKhoNhap = x;

                this.dataSource_KhoNhap = new DataSource({
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
                this.phieunhapkhoService.findPhieuNhapKho(this.phieunhapkho_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieunhapkho_chitiets.length;

                        this.phieunhapkho = data;
                        this.hanghoas = this.phieunhapkho.phieunhapkho_chitiets;
                        this.phieunhapkho.phieunhapkho_chitiets_old = this.phieunhapkho.phieunhapkho_chitiets;
                    },
                    (error) => {
                        this.phieunhapkhoService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            // xem lịch sử xử lý sau
        }
    }

    /* lấy cái này xoá phần thêm 1 dòng hàng hoá */
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
            this.hanghoas[index].khonhap_id = this.phieunhapkho.khonhap_id;
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
