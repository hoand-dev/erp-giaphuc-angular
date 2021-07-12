import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChiNhanh, KhoHang, NhaCungCap, PhieuMuaHangNCC, PhieuMuaHangNCC_ChiTiet, PhieuTraHangNCC, PhieuTraHangNCC_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, HangHoaService, KhoHangService, LichSuService, NhaCungCapService, PhieuMuaHangNCCService, PhieuTraHangNCCService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-phieu-tra-hang-ncc-view-modal',
    templateUrl: './phieu-tra-hang-ncc-view-modal.component.html',
    styleUrls: ['./phieu-tra-hang-ncc-view-modal.component.css']
})
export class PhieuTraHangNccViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieutrahangncc_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;
    public phieutrahangncc: PhieuTraHangNCC;

    public lstNhaCungCap: NhaCungCap[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public dataSource_NhaCungCap: DataSource;
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuTraHangNCC_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieutrahangnccService: PhieuTraHangNCCService,
        private nhacungcapService: NhaCungCapService,
        private hanghoaService: HangHoaService,
        private khohangService: KhoHangService,
        private lichsuService: LichSuService,
        private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieutrahangncc = new PhieuTraHangNCC();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                // ? lấy danh sách kho hàng theo chi nhánh hiện tại
                this.loadingVisible = true;
                this.subscriptions.add(
                    this.khohangService.findKhoHangs(this.currentChiNhanh.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoXuat = x;
                        this.dataSource_KhoXuat = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieutrahangncc.khoxuat_id, null, loadOptions)
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
                this.phieutrahangnccService.findPhieuTraHangNCC(this.phieutrahangncc_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieutrahangncc_chitiet.length;

                        this.phieutrahangncc = data;
                        this.hanghoas = this.phieutrahangncc.phieutrahangncc_chitiet;
                    },
                    (error) => {
                        this.phieutrahangnccService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findTraHangNCC(this.phieutrahangncc_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieutrahangncc_chitiet.length;

                        this.phieutrahangncc = data;
                        this.hanghoas = this.phieutrahangncc.phieutrahangncc_chitiet;
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
            //return;
        } else {
            this.hanghoas[index].dvt_id = selected.dvt_id;

            this.hanghoas[index].dongia = 0;
            this.commonService
                .hangHoa_LayGia_NhapKho(this.phieutrahangncc.nhacungcap_id, selected.id)
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
