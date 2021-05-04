import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DanhMucGiaCong, DinhMuc, DonViGiaCong, HangHoa, KhachHang, KhoHang, PhieuYeuCauGiaCong, PhieuYeuCauGiaCongCT, SoMat } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import {
    AppInfoService,
    CommonService,
    DinhMucService,
    DonViGiaCongService,
    HangHoaService,
    KhoHangService,
    LichSuService,
    PhieuYeuCauGiaCongService,
    RouteInterceptorService,
    SoMatService
} from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-phieu-yeu-cau-gia-cong-view-modal',
    templateUrl: './phieu-yeu-cau-gia-cong-view-modal.component.html',
    styleUrls: ['./phieu-yeu-cau-gia-cong-view-modal.component.css']
})
export class PhieuYeuCauGiaCongViewModalComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'xemphieu'; // mặc định là xem lại phiếu 'xemphieu' or 'xemlichsu'

    /* thông tin cần để lấy dữ liệu */
    public phieuyeucaugiacong_id: number;

    /* thông tin copy */

    public loaiphieu: string;
    public phieuyeucaugiacong: PhieuYeuCauGiaCong;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_KhoHang: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;
    public isTatToan = false;

    public hanghoas: PhieuYeuCauGiaCongCT[] = [];
    public lstHangHoa: HangHoa[];
    public lstGiaCong: DinhMuc[];
    public lstSoMat: SoMat[];
    public dataSource_HangHoa: DataSource;
    public dataSource_GiaCong: DataSource;
    public dataSource_SoMat: DataSource;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng
    private hanghoalenght: number = 0;
    private hanghoalenght_yeucau: number = 0;
    private hanghoalenght_somat: number = 0;
    private hanghoalenght_somat_thanhpham: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute,

        private phieuyeucaugiacongService: PhieuYeuCauGiaCongService,
        private donvigiacongService: DonViGiaCongService,
        private giacongService: DinhMucService,
        private somatService: SoMatService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private lichsuService: LichSuService,
        private commonService: CommonService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.phieuyeucaugiacong = new PhieuYeuCauGiaCong();

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
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, this.phieuyeucaugiacong.khogiacong_id, 'hangtron,thanhpham', loadOptions)
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
                this.phieuyeucaugiacongService.findPhieuYeuCauGiaCong(this.phieuyeucaugiacong_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuyeucaugiacong_chitiets.length;
                        this.hanghoalenght_yeucau = data.phieuyeucaugiacong_chitiets.length;
                        this.hanghoalenght_somat = data.phieuyeucaugiacong_chitiets.length;
                        this.hanghoalenght_somat_thanhpham = data.phieuyeucaugiacong_chitiets.length;

                        this.loaiphieu = data.loaiphieu;

                        this.phieuyeucaugiacong = data;
                        this.hanghoas = this.phieuyeucaugiacong.phieuyeucaugiacong_chitiets;
                    },
                    (error) => {
                        this.phieuyeucaugiacongService.handleError(error);
                    }
                )
            );
        } else if (this.isView == 'xemlichsu') {
            this.subscriptions.add(
                this.lichsuService.findYeuCauGiaCong(this.phieuyeucaugiacong_id).subscribe(
                    (data) => {
                        // gán độ dài danh sách hàng hóa load lần đầu
                        this.hanghoalenght = data.phieuyeucaugiacong_chitiets.length;
                        this.hanghoalenght_yeucau = data.phieuyeucaugiacong_chitiets.length;
                        this.hanghoalenght_somat = data.phieuyeucaugiacong_chitiets.length;
                        this.hanghoalenght_somat_thanhpham = data.phieuyeucaugiacong_chitiets.length;

                        this.loaiphieu = data.loaiphieu;

                        this.phieuyeucaugiacong = data;
                        this.hanghoas = this.phieuyeucaugiacong.phieuyeucaugiacong_chitiets;
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
            this.hanghoas[index].arr_yeucaus = JSON.parse(this.hanghoas[index].yeucaus);
            this.hanghoalenght_yeucau = this.hanghoas[index].arr_yeucaus.length;
            this.hanghoas[index].yeucaus = this.hanghoas[index].arr_yeucaus.toString();
        } else {
            this.hanghoas[index].khogiacong_id = this.phieuyeucaugiacong.khogiacong_id;
            this.hanghoas[index].xuatnguyenlieu = this.phieuyeucaugiacong.xuatnguyenlieu;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            // this.onTaoThanhPham(index);
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
            //  this.onHangHoaAdd();
        }
    }
    onYeuCauChanged(index, e) {
        if (this.hanghoalenght_yeucau > 0) {
            this.hanghoalenght_yeucau--;
        } else this.onTaoThanhPham(index);
    }

    onSoMatYeuCauChanged(index, e) {
        let selected = e.selectedItem;
        if (this.hanghoalenght_somat > 0) {
            this.hanghoalenght_somat--;
        } else {
            // gán số mặt cho thành phẩm
            this.hanghoas[index].somat_thanhpham_id = selected.id;

            // gán giá trị hệ số
            this.hanghoas[index].heso = selected.giatri;
        }
    }

    onSoMatThanhPhamChanged(index, e) {
        let selected = e.selectedItem;
        if (this.hanghoalenght_somat_thanhpham > 0) {
            this.hanghoalenght_somat_thanhpham--;
        } else {
            /* tạo lại mã mới cho thành phẩm */
            this.onTaoThanhPham(index);
        }
    }

    onTaoThanhPham(index) {
        if (this.hanghoas[index].hanghoa_id != null && this.hanghoalenght == 0) {
            let somat = this.lstSoMat.find((x) => x.id == this.hanghoas[index].somat_thanhpham_id);
            let masomat: string = somat != null ? somat.masomat.toString().trim() : '';
            let tensomat: string = somat != null ? somat.tensomat.toString().trim() : '';

            let _: string = ' ';

            this.subscriptions.add(
                this.hanghoaService.findHangHoa(this.hanghoas[index].hanghoa_id).subscribe((x) => {
                    let hanghoa: HangHoa = x;
                    if (hanghoa != undefined) {
                        let idgiacongs_thanhpham: number[] = JSON.parse(hanghoa.idgiacongs);

                        let magiacong: string = '';
                        let tengiacong: string = '';
                        if (this.hanghoas[index].arr_yeucaus != null) {
                            this.hanghoas[index].arr_yeucaus.forEach((value, index) => {
                                let giacong = this.lstGiaCong.find((x) => x.id == value);
                                if (typeof giacong === 'object') {
                                    if (hanghoa.loaihanghoa == 'thanhpham' && idgiacongs_thanhpham !== null && !idgiacongs_thanhpham.includes(value)) {
                                        magiacong += giacong.madinhmuc;
                                        tengiacong += giacong.tendinhmuc + ' ';
                                    }
                                    if (hanghoa.loaihanghoa != 'thanhpham') {
                                        magiacong += giacong.madinhmuc;
                                        tengiacong += giacong.tendinhmuc + ' ';
                                    }
                                }
                            });
                            tengiacong = tengiacong.trim();
                        }

                        if (hanghoa.loaihanghoa == 'thanhpham') {
                            magiacong = magiacong + hanghoa.magiacong;
                            tengiacong = tengiacong + _ + hanghoa.tengiacong;
                        }

                        let mahanghoa: string = magiacong + masomat + hanghoa.matieuchuan + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + hanghoa.ncc + hanghoa.maloaihang;
                        let tenhanghoa: string =
                            tengiacong + _ + tensomat + _ + hanghoa.tentieuchuan + _ + '(' + hanghoa.day + 'x' + hanghoa.rong + 'x' + hanghoa.dai + ')' + _ + hanghoa.ncc + _ + hanghoa.tenloaihang;

                        this.hanghoas[index].mathanhpham = mahanghoa.split('null').join('').trim();
                        this.hanghoas[index].tenthanhpham = tenhanghoa.split('null').join('').trim();

                        if (this.hanghoas[index].arr_yeucaus.length > 0) this.hanghoas[index].yeucaus = this.hanghoas[index].arr_yeucaus.toString();
                    }
                })
            );
        }
    }

    displayExprHangHoa(item) {
        return item && item.tenhanghoa; //+ ' (' + item.soluong_tonhientai + ', ' + item.soluong_tonduocxuat + ')';
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
