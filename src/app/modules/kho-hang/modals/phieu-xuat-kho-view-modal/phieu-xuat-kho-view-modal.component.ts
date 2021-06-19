import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, KhoHang, NhaCungCap, PhieuXuatKho, PhieuXuatKho_ChiTiet } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DanhSachXeService, HangHoaService, KhoHangService, LichSuService, PhieuXuatKhoService, TaiXeService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-phieu-xuat-kho-view-modal',
  templateUrl: './phieu-xuat-kho-view-modal.component.html',
  styleUrls: ['./phieu-xuat-kho-view-modal.component.css']
})
export class PhieuXuatKhoViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuxuatkho_id: number;

    /* thông tin copy */
    private currentChiNhanh: ChiNhanh;

    public phieuxuatkho: PhieuXuatKho;
    public lstTaiXe: TaiXe[] = [];
    public lstXe: DanhSachXe[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public dataSource_TaiXe: DataSource;
    public dataSource_Xe: DataSource;
    public dataSource_KhoXuat: DataSource;

    public hanghoas: PhieuXuatKho_ChiTiet[] = [];
    public dataSource_HangHoa: DataSource;

    private hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private phieuxuatkhoService: PhieuXuatKhoService,
        private khohangService: KhoHangService,
        private taixeService: TaiXeService,
        private xeService: DanhSachXeService,
        private hanghoaService: HangHoaService,
        private lichsuService: LichSuService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuxuatkho = new PhieuXuatKho();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.subscriptions.add(
            this.taixeService.findTaiXes().subscribe((x) => {
                this.lstTaiXe = x;

                this.dataSource_TaiXe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.xeService.findDanhSachXes().subscribe((x) => {
                this.lstXe = x;

                this.dataSource_Xe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        // ? lấy danh sách kho hàng theo chi nhánh hiện tại
        this.subscriptions.add(
            this.khohangService.findKhoHangs(this.currentChiNhanh.id).subscribe((x) => {
                this.lstKhoXuat = x;

                this.dataSource_KhoXuat = new DataSource({
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
                this.phieuxuatkhoService.findPhieuXuatKho(this.phieuxuatkho_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuxuatkho_chitiets.length;

                        this.phieuxuatkho = data;
                        this.hanghoas = this.phieuxuatkho.phieuxuatkho_chitiets;
                        this.phieuxuatkho.phieuxuatkho_chitiets_old = this.phieuxuatkho.phieuxuatkho_chitiets;
                    },
                    (error) => {
                        this.phieuxuatkhoService.handleError(error);
                    }
                )
            );
        } 
        else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findXuatKho(this.phieuxuatkho_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuxuatkho_chitiets.length;

                        this.phieuxuatkho = data;
                        this.hanghoas = this.phieuxuatkho.phieuxuatkho_chitiets;
                        this.phieuxuatkho.phieuxuatkho_chitiets_old = this.phieuxuatkho.phieuxuatkho_chitiets;
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
            this.hanghoas[index].khoxuat_id = this.phieuxuatkho.khoxuat_id;
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

