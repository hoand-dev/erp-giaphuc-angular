import { ChiNhanh, KhoHang, PhieuXuatKho, PhieuXuatKho_ChiTiet } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, KhoHangService, KhachHangService, PhieuXuatKhoService, DanhSachXeService, TaiXeService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { KhachHang } from '@app/shared/entities';
import { HangHoaService } from '@app/shared/services';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import moment from 'moment';

@Component({
    selector: 'app-phieu-xuat-kho-cap-nhat',
    templateUrl: './phieu-xuat-kho-cap-nhat.component.html',
    styleUrls: ['./phieu-xuat-kho-cap-nhat.component.css']
})
export class PhieuXuatKhoCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmPhieuXuatKho: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public phieuxuatkho: PhieuXuatKho;
    public lstTaiXe: TaiXe[] = [];
    public lstXe: DanhSachXe[] = [];
    public lstKhoXuat: KhoHang[] = [];

    public dataSource_TaiXe: DataSource;
    public dataSource_Xe: DataSource;
    public dataSource_KhoXuat: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public hanghoas: PhieuXuatKho_ChiTiet[] = [];
    public dataSource_HangHoa: any = {};

    // điều kiện để hiển thị danh sách hàng hoá
    public isValidForm: boolean = false;

    // dùng để kiểm tra load lần đầu (*)
    private hanghoalenght: number = 0;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private phieuxuatkhoService: PhieuXuatKhoService,
        private taixeService: TaiXeService,
        private xeService: DanhSachXeService,
        private khohangService: KhoHangService,
        private hanghoaService: HangHoaService,
        private commonService: CommonService
    ) {}

    ngAfterViewInit() {
        // this.frmPhieuXuatKho.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        // cập nhật thông tin phiếu không cho thay đổi chi nhánh
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.phieuxuatkho = new PhieuXuatKho();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.taixeService.findTaiXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstTaiXe = x;

                this.dataSource_TaiXe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.loadingVisible = true;
        this.subscriptions.add(
            this.xeService.findDanhSachXes().subscribe((x) => {
                this.loadingVisible = false;
                this.lstXe = x;

                this.dataSource_Xe = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

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

        this.loadingVisible = true;
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let phieuxuatkho_id = params.id;
                // lấy thông tin
                if (phieuxuatkho_id) {
                    this.subscriptions.add(
                        this.phieuxuatkhoService.findPhieuXuatKho(phieuxuatkho_id).subscribe(
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
            })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        if (e.value === undefined) return;

        // nếu thay đổi nhà cung cấp
        // if (e.dataField == 'nhacungcap' && e.value !== undefined) {
        //     // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
        //     this.isValidForm = true;

        //     // gán lại thông tin điện thoại + địa chỉ nhà cung cấp

        //     this.phieuxuatkho.nhacungcap_id = e.value ? e.value.id : null;
        // }

        // // nếu thay đổi chiết khấu -> set chiết khấu hàng hoá = 0
        // if (e.dataField == 'chietkhau' && e.value != 0) {
        //     this.hanghoas.forEach((v, i) => {
        //         v.chietkhau = 0;
        //     });
        // }

        // // nếu thay đổi thuế vat -> set thuế vat hàng hoá = 0
        // if (e.dataField == 'thuevat' && e.value != 0) {
        //     this.hanghoas.forEach((v, i) => {
        //         v.thuevat = 0;
        //     });
        // }

        // nếu thay đổi kho xuất -> set khoxuat_id cho hàng hoá
        if (e.dataField == 'khoxuat_id' && e.value !== undefined && e.value !== null) {
            // hiển thị danh sách hàng hoá đã thoả điều kiện là chọn ncc
            this.isValidForm = true;
            
            this.hanghoas.forEach((v, i) => {
                v.khoxuat_id = this.phieuxuatkho.khoxuat_id;
            });
        }

        if (e.dataField == 'taixe_id') {
            let taixe = this.lstTaiXe.find(x => x.id == this.phieuxuatkho.taixe_id);
            this.phieuxuatkho.taixe_dienthoai = taixe ? taixe.dienthoai : null;
        }

        // thay đổi ngày tới hạn
        if(e.dataField == 'songaytoihan'){
            // trường hợp số ngày tới hạn bằng 0 và ngược lại
            if(e.value == 0 || e.value == null){
                this.phieuxuatkho.ngaytoihan = null;
            }
            else{
                this.phieuxuatkho.ngaytoihan = moment(this.phieuxuatkho.ngayxuatkho).add(e.value, 'days').toDate();
            }
        }

        // tính tổng tiền
        this.onTinhTien();
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new PhieuXuatKho_ChiTiet());
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
            setTimeout(() => {
                this.hanghoas[index].mahanghoa = selected.mahanghoa;
                this.hanghoas[index].tenhanghoa = selected.tenhanghoa;
            });
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
            //this.onHangHoaAdd();
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
                    this.phieuxuatkho.chietkhau = 0;
                }
                break;
            case 'thuevat':
                this.hanghoas[index].thuevat = e.value;
                if (e.value != 0) {
                    this.phieuxuatkho.thuevat = 0;
                }
                break;
        }

        // tính tiền sau chiết khấu
        this.onTinhTien();
    }

    // tính tiền sau chiết khấu và tổng
    private onTinhTien() {
        let tongtienhang: number = 0;

        this.hanghoas.forEach((v, i) => {
            v.thanhtien = v.soluong * v.dongia;
            v.thanhtien = v.thanhtien - v.thanhtien * v.chietkhau + (v.thanhtien - v.thanhtien * v.chietkhau) * v.thuevat;

            tongtienhang += v.thanhtien;
        });
        this.phieuxuatkho.tongtienhang = tongtienhang;
        this.phieuxuatkho.tongthanhtien = tongtienhang - tongtienhang * this.phieuxuatkho.chietkhau + (tongtienhang - tongtienhang * this.phieuxuatkho.chietkhau) * this.phieuxuatkho.thuevat;
    }

    public onSubmitForm(e) {
        // bỏ qua các dòng dữ liệu không chọn hàng hóa, nguồn lực và chi phí khác
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null && (x.soluong != 0));
        let phieuxuatkho_req = this.phieuxuatkho;

        // gán lại dữ liệu
        phieuxuatkho_req.chinhanh_id = this.currentChiNhanh.id;
        phieuxuatkho_req.phieuxuatkho_chitiets = hanghoas;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.phieuxuatkhoService.updatePhieuXuatKho(phieuxuatkho_req).subscribe(
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
                    this.router.navigate(['/phieu-xuat-kho']);
                    this.frmPhieuXuatKho.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.phieuxuatkhoService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
