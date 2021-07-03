import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, DonViGiaCong, LenhSanXuat, LenhSanXuat_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, DonViGiaCongService, DonViTinhService, HangHoaService, KhoHangService, LenhSanXuatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-lenh-san-xuat-modal',
    templateUrl: './lenh-san-xuat-modal.component.html',
    styleUrls: ['./lenh-san-xuat-modal.component.css']
})
export class LenhSanXuatModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmLenhSanXuat: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public lenhsanxuat_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public lenhsanxuat: LenhSanXuat;
    public saveProcessing = false;

    public dataSource_DonViGiaCong: DataSource;
    public dataSource_HangHoa: DataSource;
    public dataSource_KhoHang: DataSource;
    public dataSource_DonViTinh: DataSource;

    public hanghoas: LenhSanXuat_ChiTiet[] = [];
    public lstDonViGiaCong: DonViGiaCong[];
    public hanghoalenght: number = 0;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private lenhsanxuatService: LenhSanXuatService,
        private donvigiacongService: DonViGiaCongService,
        private hanghoaService: HangHoaService,
        private donvitinhService: DonViTinhService,
        public khohangService: KhoHangService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.lenhsanxuat = new LenhSanXuat();
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;

                this.subscriptions.add(
                    this.khohangService.findKhoHangs(x.id).subscribe((x) => {
                        this.dataSource_KhoHang = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );

                this.subscriptions.add(
                    this.donvigiacongService.findDonViGiaCongs(this.authenticationService.currentChiNhanhValue.id).subscribe((x) => {
                        this.lstDonViGiaCong = x;
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
            this.donvitinhService.findDonViTinhs().subscribe((x) => {
                this.dataSource_DonViTinh = new DataSource({
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
                    loadOptions['checkdinhmuc'] = true;
                    return this.commonService
                        .hangHoa_TonKhoHienTai(this.currentChiNhanh.id, null, 'nguyenlieu', loadOptions)
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
        
        if (this.isView == 'view_add'){
            this.onHangHoaAdd();
        }

        if (this.isView == 'view_edit' || this.isView == 'view') {
            this.subscriptions.add(
                this.lenhsanxuatService.findLenhSanXuat(this.lenhsanxuat_id).subscribe(
                    (data) => {
                        this.lenhsanxuat = data;
                        this.hanghoas = this.lenhsanxuat.lenhsanxuat_chitiets;
                    },
                    (error) => {
                        this.lenhsanxuatService.handleError(error);
                    }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    clickLayGia() {
        this.hanghoas.forEach((e) => {
            if (e.hanghoa_id != null)
                this.subscriptions.add(
                    this.lenhsanxuatService.laygiaLenhSanXuat(e.hanghoa_id).subscribe((x) => {
                        e.dongia = x;
                    })
                );
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.hanghoas, event.previousIndex, event.currentIndex);
    }
    
    public onHangHoaAdd() {
        this.hanghoas.push(new LenhSanXuat_ChiTiet());
    }

    public onHangHoaDelete(item) {
        this.hanghoas = this.hanghoas.filter(function (i) {
            return i !== item;
        });
        this.onTinhTien();
    }

    public onHangHoaChanged(index, e) {
        let selected = e.selectedItem;

        if (this.hanghoalenght > 0) {
            this.hanghoalenght--;
        } else {
            this.hanghoas[index].dvt_id = selected.dvt_id;
        }
        
        this.hanghoas[index].loaihanghoa = selected.loaihanghoa;
        
        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.hanghoa_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    public onHangHoaChangeRow(col: string, index: number, e: any) {
        this.onTinhTien();
    }

    private onTinhTien() {
        let tongtienhang: number = 0;
        this.hanghoas.forEach((v, i) => {
            v.soluongconlai = v.soluong - v.soluongdanhap - v.soluongtattoan;
            v.thanhtien = (v.soluong - v.soluongtattoan) * v.dongia;
            tongtienhang += v.thanhtien;
        });
        this.lenhsanxuat.tongthanhtien = tongtienhang;
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'donvigiacong_id' && e.value !== undefined) {
            let donvigiacong = this.lstDonViGiaCong.find((x) => x.id == this.lenhsanxuat.donvigiacong_id);
            this.lenhsanxuat.khogiacong_id = donvigiacong ? donvigiacong.khogiacong_id : null;
        }
    }

    onSubmitForm(e) {
        if (!this.frmLenhSanXuat.instance.validate().isValid) return;
        let hanghoas = this.hanghoas.filter((x) => x.hanghoa_id != null);

        let lenhsanxuat_req = this.lenhsanxuat;
        lenhsanxuat_req.chinhanh_id = this.currentChiNhanh.id;
        lenhsanxuat_req.lenhsanxuat_chitiets = hanghoas;

        if (this.isView == 'view_add') {
            this.onAddNew(lenhsanxuat_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(lenhsanxuat_req);
        }

        e.preventDefault();
    }

    onAddNew(lenhsanxuat_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.lenhsanxuatService.addLenhSanXuat(lenhsanxuat_req).subscribe(
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

                    this.saveProcessing = false;
                    this.onConfirm();
                },
                (error) => {
                    this.lenhsanxuatService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(lenhsanxuat_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.lenhsanxuatService.updateLenhSanXuat(lenhsanxuat_req).subscribe(
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

                    this.saveProcessing = false;
                    this.onConfirm();
                },
                (error) => {
                    this.lenhsanxuatService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onConfirm(): void {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
