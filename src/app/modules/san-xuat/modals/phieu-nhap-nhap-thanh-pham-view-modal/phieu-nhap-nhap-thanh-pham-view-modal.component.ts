import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DinhMuc, DonViGiaCong, HangHoa, KhachHang, KhoHang, PhieuNhapKhoGiaCong, PhieuNhapKhoGiaCongCT, PhieuYeuCauGiaCongCT, SoMat } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    CommonService,
    DinhMucService,
    DonViGiaCongService,
    HangHoaService,
    KhachHangService,
    KhoHangService,
    LichSuService,
    PhieuNhapKhoGiaCongService,
    PhieuXuatKhoGiaCongService,
    PhieuYeuCauGiaCongService,
    RouteInterceptorService,
    SoMatService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DanhSachLoiModalComponent } from '../../modals/danh-sach-loi-modal/danh-sach-loi-modal.component';
import { DanhSachPhieuYeuCauGiaCongModalComponent } from '../../modals/danh-sach-phieu-yeu-cau-gia-cong-modal/danh-sach-phieu-yeu-cau-gia-cong-modal.component';

@Component({
    selector: 'app-phieu-nhap-nhap-thanh-pham-view-modal',
    templateUrl: './phieu-nhap-nhap-thanh-pham-view-modal.component.html',
    styleUrls: ['./phieu-nhap-nhap-thanh-pham-view-modal.component.css']
})
export class PhieuNhapNhapThanhPhamViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;
    private currentChiNhanh: ChiNhanh;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieunhapkhogiacong_id: number;

    /* thông tin copy */

    public loaiphieu: string = 'taikho';
    public phieunhapkhogiacong: PhieuNhapKhoGiaCong;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_KhachHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuNhapKhoGiaCongCT[] = [];

    public lstHangHoa: HangHoa[];
    public lstGiaCong: DinhMuc[];
    public lstSoMat: SoMat[];
    public lstKhachHang: KhachHang[] = [];

    public dataSource_HangHoa: DataSource;
    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;
    private hanghoalenght_yeucau: number = 0;

    public bsModalRefChild: BsModalRef;

    constructor(
        public sumTotal: SumTotalPipe,
        private authenticationService: AuthenticationService,
        public bsModalRef: BsModalRef,

        private khachhangService: KhachHangService,
        private activatedRoute: ActivatedRoute,

        private commonService: CommonService,
        private phieunhapkhogiacongService: PhieuNhapKhoGiaCongService,
        private phieuyeucaugiacongService: PhieuYeuCauGiaCongService,
        private donvigiacongService: DonViGiaCongService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private giacongService: DinhMucService,
        private somatService: SoMatService,
        private lichsuService: LichSuService,
        private modalService: BsModalService
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieunhapkhogiacong = new PhieuNhapKhoGiaCong();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                        this.loadingVisible = false;
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
                this.loadingVisible = false;
                this.lstKhachHang = x;

                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        
        this.subscriptions.add(
            this.giacongService.findDinhMucs().subscribe((x) => {
                this.lstGiaCong = x;
                this.dataSource_GiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.somatService.findSoMats().subscribe((x) => {
                this.lstSoMat = x;
                this.dataSource_SoMat = new DataSource({
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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieunhapkhogiacong.khogiacong_id, 'hangtron,thanhpham', loadOptions)
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
                this.phieunhapkhogiacongService.findPhieuNhapKhoGiaCong(this.phieunhapkhogiacong_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieunhapkhogiacong_chitiets.length;

                        this.phieunhapkhogiacong = data;
                        this.hanghoas = this.phieunhapkhogiacong.phieunhapkhogiacong_chitiets;
                    },
                    (error) => {
                        this.phieunhapkhogiacongService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findNhapKhoGiaCong(this.phieunhapkhogiacong_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieunhapkhogiacong_chitiets.length;

                        this.phieunhapkhogiacong = data;
                        this.hanghoas = this.phieunhapkhogiacong.phieunhapkhogiacong_chitiets;
                    },
                    (error) => {
                        this.lichsuService.handleError(error);
                    }
                )
            );
        }
    }
    onFormFieldChanged(e) {
        if (e.dataField == 'khonhap_id' && e.value !== undefined) {
            this.hanghoas.forEach((v, i) => {
                v.khonhap_id = this.phieunhapkhogiacong.khonhap_id;
            });
        }
    }

    displayExprHangHoa(item) {
        return item && item.tenhanghoa; //+ ' (' + item.soluong_tonhientai + ', ' + item.soluong_tonduocxuat + ')';
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            this.hanghoas[index].arr_yeucaus = JSON.parse(this.hanghoas[index].yeucaus);
            this.hanghoalenght_yeucau = this.hanghoas[index].arr_yeucaus.length;
            this.hanghoas[index].yeucaus = this.hanghoas[index].arr_yeucaus.toString();

            this.hanghoas[index].chitietlois = JSON.parse(this.hanghoas[index].lois);
        }

        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        this.hanghoas[index].tilequydoiphu = selected.quydoi1;
        this.hanghoas[index].trongluong = selected.trongluong;
        this.hanghoas[index].m3 = selected.m3;
        this.hanghoas[index].tendonvitinh = selected.tendonvitinh;
        this.hanghoas[index].tendonvitinhphu = selected.tendonvitinhphu;
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        this.onTinhTien();
    }

    private onTinhTien() {
        let tongtienhang: number = 0;
        this.hanghoas.forEach((v, i) => {
            v.tongtrongluong = v.soluong * v.trongluong;
            v.tongkien = v.tendonvitinhphu ? v.soluong / v.tilequydoiphu : 0;
            v.tongm3 = v.soluong * v.m3;
            //v.soluongconlai  = v.soluong - v.soluongdaxuat;

            v.thanhtien = v.soluong * v.dongia * v.heso;
            tongtienhang += v.thanhtien;
        });
        this.phieunhapkhogiacong.tongthanhtien = tongtienhang;
    }

    public onclickSoLuongLoi(index) {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'CHI TIẾT LỖI', // và nhiều hơn thế nữa
            chitietlois: this.hanghoas[index].chitietlois
        };

        /* hiển thị modal */
        this.bsModalRefChild = this.modalService.show(DanhSachLoiModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRefChild.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRefChild.content.onClose.subscribe((result) => {
            if (result !== false) {
                this.hanghoas[index].chitietlois = result;
                let soluongloi: number = 0;
                result.forEach((e) => {
                    soluongloi += e.soluong;
                });
                this.hanghoas[index].soluongloi = soluongloi;
            }
        });
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
