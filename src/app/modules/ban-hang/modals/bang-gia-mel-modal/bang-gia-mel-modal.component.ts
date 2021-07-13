import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChiNhanh, BangGiaMel, BangGiaMel_ChiTiet } from '@app/shared/entities';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';
import { CommonService, BangGiaMelService, KhachHangService, DanhMucGiaCongService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-bang-gia-mel-modal',
  templateUrl: './bang-gia-mel-modal.component.html',
  styleUrls: ['./bang-gia-mel-modal.component.css']
})
export class BangGiaMelModalComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmBangGiaMel: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    /* kiểm tra xem là xem lại thông tin phiếu hay xem log */
    public isView: string = 'view_add'; // 'view', 'view_history', 'view_add', 'view_edit'

    /* thông tin cần để lấy dữ liệu */
    public banggiamel_id: number;

    /* thông tin */
    private currentChiNhanh: ChiNhanh;
    public banggiamel: BangGiaMel;
    public saveProcessing = false;

    public dataSource_DanhMucGiaCong: DataSource;
    public dataSource_KhachHang: DataSource;

    public hanghoas: BangGiaMel_ChiTiet[] = [];
    public hanghoalenght: number = 0;

    constructor(
        public bsModalRef: BsModalRef,
        private authenticationService: AuthenticationService,
        private commonService: CommonService,
        private banggiamelService: BangGiaMelService,
        private khachhangService: KhachHangService,
        private danhmucgiacongService: DanhMucGiaCongService,
        public sumTotal: SumTotalPipe
    ) {}

    ngOnInit(): void {
        this.onClose = new Subject();

        this.banggiamel = new BangGiaMel();
        this.banggiamel.ngaycohieuluc = new Date();
        
        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.subscriptions.add(
            this.khachhangService.findKhachHangs().subscribe((x) => {
                this.dataSource_KhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.danhmucgiacongService.findDanhMucGiaCongs().subscribe((data) => {
                this.dataSource_DanhMucGiaCong = new DataSource({
                    store: data,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        
        if (this.isView == 'view_add'){
            this.onHangHoaAdd();
        }

        if (this.isView == 'view_edit' || this.isView == 'view') {
            this.subscriptions.add(
                this.banggiamelService.findBangGiaMel(this.banggiamel_id).subscribe(
                    (data) => {
                        this.hanghoalenght = data.banggiamel_chitiet.length;
                        this.banggiamel = data;
                        this.hanghoas = this.banggiamel.banggiamel_chitiet;
                    },
                    (error) => {
                        this.banggiamelService.handleError(error);
                    }
                )
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
    
    onChangeFile(event) {
        let file = event.srcElement.files;
        this.subscriptions.add(
            this.banggiamelService.uploadExcel(file).subscribe(
                (data) => {
                    this.hanghoas = [];
                    this.hanghoas = data.filter((v) => v.giacong_id != null);
                },
                (error) => {
                    this.banggiamelService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    public onHangHoaAdd() {
        this.hanghoas.push(new BangGiaMel_ChiTiet());
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
        } else {
            
        }
        
        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.hanghoas.filter((x) => x.giacong_id == null);
        if (rowsNull.length == 0) {
            this.onHangHoaAdd();
        }
    }

    onFormFieldChanged(e) {
        // tạm thời chưa có gì để xử lý
    }

    onSubmitForm(e) {
        if (!this.frmBangGiaMel.instance.validate().isValid) return;
        let hanghoas = this.hanghoas.filter((x) => x.giacong_id != null);

        let banggiamel_req = this.banggiamel;
        banggiamel_req.chinhanh_id = this.currentChiNhanh.id;
        banggiamel_req.banggiamel_chitiet = hanghoas;

        if (this.isView == 'view_add') {
            this.onAddNew(banggiamel_req);
        }

        if (this.isView == 'view_edit') {
            this.onUpdate(banggiamel_req);
        }

        e.preventDefault();
    }

    onAddNew(banggiamel_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.banggiamelService.addBangGiaMel(banggiamel_req).subscribe(
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
                    this.banggiamelService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
    }

    onUpdate(banggiamel_req) {
        this.saveProcessing = true;
        this.subscriptions.add(
            this.banggiamelService.updateBangGiaMel(banggiamel_req).subscribe(
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
                    this.banggiamelService.handleError(error);
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
