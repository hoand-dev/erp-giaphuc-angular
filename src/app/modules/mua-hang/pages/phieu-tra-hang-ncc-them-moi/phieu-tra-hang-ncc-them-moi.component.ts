import { ChiNhanh, KhoHang, PhieuTraHangNCC, PhieuTraHangNCC_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AppInfoService, CommonService, KhoHangService, NhaCungCapService, PhieuMuaHangNCCService, PhieuTraHangNCCService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { NhaCungCap } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import { DanhSachPhieuMuaHangNCCModalComponent } from '../../modals/danh-sach-phieu-mua-hang-ncc-modal/danh-sach-phieu-mua-hang-ncc-modal.component';

@Component({
    selector: 'app-phieu-tra-hang-ncc-them-moi',
    templateUrl: './phieu-tra-hang-ncc-them-moi.component.html',
    styleUrls: ['./phieu-tra-hang-ncc-them-moi.component.css']
})
export class PhieuTraHangNCCThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuTraHangNCC: DxFormComponent;

    bsModalRef: BsModalRef;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieutrahangncc: PhieuTraHangNCC;
    public lstNhaCungCap: NhaCungCap[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuTraHangNCC_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*) nếu được chọn từ phiếu mua hàng ncc
    private hanghoalenght: number = 0;

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

        private objPhieuMuaHangNCCService: PhieuMuaHangNCCService,
        private phieutrahangnccService: PhieuTraHangNCCService,
        private nhacungcapService: NhaCungCapService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuTraHangNCC.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.phieutrahangncc = new PhieuTraHangNCC();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                // ? lấy danh sách kho hàng theo chi nhánh hiện tại
                this.loadingVisible = true;
                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstKhoXuat = x;
                    })
                );
            })
        );

        this.subscriptions.add(
            this.nhacungcapService.findNhaCungCaps().subscribe((x) => {
                this.loadingVisible = false;
                this.lstNhaCungCap = x;
            })
        );

        // lấy danh sách hàng hoá
        this.loadingVisible = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas(this.appInfoService.loaihanghoa_nguyenlieu).subscribe((x) => {
                this.loadingVisible = false;
                this.dataSource_HangHoa = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        // console.log(this.routeInterceptorService.previousUrl);

        // kiểm tra queryParams
        this.subscriptions.add(
            this.activatedRoute.queryParams.subscribe((params) => {
                if (this.commonService.isNotEmpty(params.tuphieu)) {
                    this.hanghoas = [];
                    // lấy thông tin phiếu mua hàng ncc từ api
                    this.objPhieuMuaHangNCCService.findPhieuMuaHangNCC(params.tuphieu).subscribe(
                        (data) => {
                            /* chọn từ phiếu không cho thay đổi chi nhánh */
                            setTimeout(() => {
                                this.authenticationService.setDisableChiNhanh(true);
                            });

                            /* phiếu mua hàng ncc -> phiếu trả hàng ncc */
                            // xử lý phần thông tin phiếu
                            this.phieutrahangncc.nhacungcap_id = data.nhacungcap_id;
                            this.phieutrahangncc.tongtienhang = data.tongtienhang;
                            this.phieutrahangncc.cuocvanchuyen = data.cuocvanchuyen;
                            this.phieutrahangncc.thuevat = data.thuevat;
                            this.phieutrahangncc.chietkhau = data.chietkhau;
                            this.phieutrahangncc.tongthanhtien = data.tongthanhtien;
                            this.phieutrahangncc.phieumuahang_id = data.id;
                            this.phieutrahangncc.maphieumuahangncc = data.maphieumuahangncc;

                            this.phieutrahangncc.nhacungcap = this.lstNhaCungCap.find((x) => x.id == data.nhacungcap_id);

                            // gán độ dài danh sách hàng hóa load lần đầu
                            this.hanghoalenght = data.phieumuahangncc_chitiet.length;

                            // xử lý phần thông tin chi tiết phiếu
                            data.phieumuahangncc_chitiet.forEach((value, index) => {
                                let item = new PhieuTraHangNCC_ChiTiet();

                                item.loaihanghoa = value.loaihanghoa;
                                item.hanghoa_id = value.hanghoa_id;
                                item.hanghoa_lohang_id = value.hanghoa_lohang_id;
                                item.dvt_id = value.dvt_id;
                                item.tilequydoi = value.tilequydoi;
                                item.soluong = value.soluong; // trừ số lượng đã trả hay không?
                                item.dongia = value.dongia;
                                item.thuevat = value.thuevat;
                                item.chietkhau = value.chietkhau;
                                item.thanhtien = value.thanhtien;
                                item.chuthich = value.chuthich;
                                item.phieumuahang_chitiet_id = value.id;

                                this.hanghoas.push(item);
                            });
                        },
                        (error) => {
                            this.phieutrahangnccService.handleError(error);
                        }
                    );
                }
            })
        );

        // thêm sẵn 1 dòng cho user
        this.onHangHoaAdd();
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    openModal() {
        /* khởi tạo giá trị cho modal */
        const initialState = {
            title: 'DANH SÁCH PHIẾU MUA HÀNG NCC' // và nhiều hơn thế nữa
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(DanhSachPhieuMuaHangNCCModalComponent, { class: 'modal-lg modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';

        /* nhận kết quả trả về từ modal sau khi đóng */
        this.bsModalRef.content.onClose.subscribe((result) => {
            this.router.navigate([`/phieu-tra-hang-ncc/them-moi`], { queryParams: { tuphieu: result.id } });
        });
    }

    onFormFieldChanged(e) {
        // nếu thay đổi nhà cung cấp
        if (e.dataField == 'nhacungcap') {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            this.isValidForm = true;

            // gán lại thông tin điện thoại + địa chỉ nhà cung cấp
            this.phieutrahangncc.dienthoainhacungcap = e.value ? e.value.sodienthoai : null;
            this.phieutrahangncc.diachinhacungcap = e.value ? e.value.diachi : null;
            this.phieutrahangncc.nhacungcap_id = e.value ? e.value.id : null;

            // load nợ cũ ncc
            this.subscriptions.add(
                this.commonService.nhaCungCap_LoadNoCu(this.phieutrahangncc.nhacungcap_id, this.phieutrahangncc.sort).subscribe((data) => {
                    this.phieutrahangncc.nocu = data;
                })
            );
        }

        // nếu thay đổi chiết khấu -> set chiết khấu hàng hoá = 0
        if (e.dataField == 'chietkhau' && e.value != 0) {
            this.hanghoas.forEach((v, i) => {
                v.chietkhau = 0;
            });
        }

        // nếu thay đổi thuế vat -> set thuế vat hàng hoá = 0
        if (e.dataField == 'thuevat' && e.value != 0) {
            this.hanghoas.forEach((v, i) => {
                v.thuevat = 0;
            });
        }

        // nếu thay đổi kho xuất -> set khoxuat_id cho hàng hoá
        if (e.dataField == 'khoxuat') {
            this.phieutrahangncc.khoxuat_id = e.value ? e.value.id : null;
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieutrahangncc.khoxuat_id;
            });
        }

        // tính tổng tiền
        this.onTinhTong();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuTraHangNCC_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        // xử lý lại thông tin dựa trên lựa chọn
        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
            //return;
        } else {
            this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
            this.hanghoas[index].dvt_id = selected.dvt_id;
            this.hanghoas[index].tendonvitinh = selected.tendonvitinh;

            this.hanghoas[index].dongia = selected.gianhap == null ? 0 : selected.gianhap;
            this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        }

        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        switch (col) {
            case 'soluong':
                this.hanghoas[index].soluong = e.value;
                break;
            case 'dongia':
                this.hanghoas[index].dongia = e.value;
                break;
            case 'chietkhau':
                this.hanghoas[index].chietkhau = e.value;
                if (e.value != 0) {
                    this.phieutrahangncc.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieutrahangncc.thuevat = 0;
                }
                break;
        }

        this.hanghoas[index].thanhtien = this.hanghoas[index].soluong * this.hanghoas[index].dongia;
        this.hanghoas[index].thanhtien =
            this.hanghoas[index].thanhtien -
            this.hanghoas[index].thanhtien * this.hanghoas[index].chietkhau +
            (this.hanghoas[index].thanhtien - this.hanghoas[index].thanhtien * this.hanghoas[index].chietkhau) * this.hanghoas[index].thuevat;

        // tính tổng tiền sau chiết khấu
        this.onTinhTong();
    }

    // tính tổng tiền hàng và tổng thành tiền sau chiết khấu
    private onTinhTong() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            tongtienhang += v.thanhtien;
        });
        this.phieutrahangncc.tongtienhang = tongtienhang;
        this.phieutrahangncc.tongthanhtien =
            tongtienhang - tongtienhang * this.phieutrahangncc.chietkhau + (tongtienhang - tongtienhang * this.phieutrahangncc.chietkhau) * this.phieutrahangncc.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);
        let phieutrahangncc_req = this.phieutrahangncc;

        // gán lại dữ liệu
        phieutrahangncc_req.chinhanh_id = this.currentChiNhanh.id;
        phieutrahangncc_req.nhacungcap_id = phieutrahangncc_req.nhacungcap.id;
        phieutrahangncc_req.khoxuat_id = phieutrahangncc_req.khoxuat.id;

        phieutrahangncc_req.phieutrahangncc_chitiet = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieutrahangnccService.addPhieuTraHangNCC(phieutrahangncc_req).subscribe(
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
                    this.router.navigate(['/phieu-tra-hang-ncc']);
                    this.frmPhieuTraHangNCC.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieutrahangnccService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
