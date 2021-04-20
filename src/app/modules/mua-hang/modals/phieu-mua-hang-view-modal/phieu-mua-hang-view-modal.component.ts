import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, KhoHang, NhaCungCap, PhieuMuaHangNCC, PhieuMuaHangNCC_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, HangHoaService, KhoHangService, NhaCungCapService, PhieuMuaHangNCCService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-mua-hang-view-modal',
    templateUrl: './phieu-mua-hang-view-modal.component.html',
    styleUrls: ['./phieu-mua-hang-view-modal.component.css']
})
export class PhieuMuaHangViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieumuahangncc_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;
    public phieumuahangncc: PhieuMuaHangNCC;

    public lstNhaCungCap: NhaCungCap[] = [];
    public dataSource_NhaCungCap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuMuaHangNCC_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieumuahangNCCService: PhieuMuaHangNCCService,
        private nhacungcapService: NhaCungCapService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieumuahangncc = new PhieuMuaHangNCC();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNhaCungCap = x;

                this.dataSource_NhaCungCap = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
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
                this.phieumuahangNCCService.findPhieuMuaHangNCC(this.phieumuahangncc_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieumuahangncc_chitiet.length;

                        this.phieumuahangncc = data;
                        this.hanghoas = this.phieumuahangncc.phieumuahangncc_chitiet;
                    },
                    (error) => {
                        this.phieumuahangNCCService.handleError(error);
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
            //return;
        } else {
            this.hanghoas[index].dvt_id = selected.dvt_id;

            this.hanghoas[index].dongia = 0;
            this.commonService
                .hangHoa_LayGia_NhapKho(this.phieumuahangncc.nhacungcap_id, selected.id)
                .toPromise()
                .then((data) => {
                    this.hanghoas[index].dongia = data ? data : 0;
                    this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
                });
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        // let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        // if (rowsNull.length == 0) {
        //     this.onHangHoaAdd();
        // }
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
