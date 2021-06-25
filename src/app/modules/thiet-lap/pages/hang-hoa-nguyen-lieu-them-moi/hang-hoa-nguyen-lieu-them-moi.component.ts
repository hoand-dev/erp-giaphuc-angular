import { ChiNhanh, DonViTinh, HangHoa } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';
import _ from 'lodash';

import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, DinhMucService, DonViTinhService, HangHoaService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import DataSource from 'devextreme/data/data_source';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HangHoaDonViTinhModalComponent } from '../../modals/hang-hoa-don-vi-tinh-modal/hang-hoa-don-vi-tinh-modal.component';
import { custom } from 'devextreme/ui/dialog';

@Component({
    selector: 'app-hang-hoa-nguyen-lieu-them-moi',
    templateUrl: './hang-hoa-nguyen-lieu-them-moi.component.html',
    styleUrls: ['./hang-hoa-nguyen-lieu-them-moi.component.css']
})
export class HangHoaNguyenLieuThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmHangHoa: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public hanghoa: HangHoa;
    public bsModalRef: BsModalRef;

    public lstDonViTinh: DonViTinh[] = [];
    public dataSource_DonViTinh: DataSource;
    public dataSource_GiaCong: DataSource;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    public btnExchangeDonViTinh = {};

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private hanghoaService: HangHoaService,
        private donvitinhService: DonViTinhService,
        private giacongService: DinhMucService,
        private modalService: BsModalService
    ) {}

    ngAfterViewInit() {
        // this.frmHangHoa.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.hanghoa = new HangHoa();
        this.hanghoa.loaihanghoa = this.appInfoService.loaihanghoa_nguyenlieu;

        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));

        this.btnExchangeDonViTinh = {
            hint: 'Chuyển đổi',
            icon: 'refresh',
            onClick: () => {
                /* phải chọn dvt r mới cho chuyển đổi */
                if(!this.hanghoa.dvt_id){
                    custom({messageHtml: 'Vui lòng chọn đơn vị tính.', showTitle: false}).show();
                    return false;
                }

                /* khởi tạo giá trị cho modal */
                const initialState = {
                    title: 'CHUYỂN ĐỔI ĐVT: ' + (this.hanghoa.tenhanghoa || ''), // và nhiều hơn thế nữa
                    hanghoadvts: _.cloneDeep(this.hanghoa.hanghoadvts),
                    dvt_id: this.hanghoa.dvt_id
                };
    
                /* hiển thị modal */
                this.bsModalRef = this.modalService.show(HangHoaDonViTinhModalComponent, { class: 'modal-xl modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
                this.bsModalRef.content.closeBtnName = 'Đóng';
    
                /* nhận kết quả trả về từ modal sau khi đóng */
                this.bsModalRef.content.onClose.subscribe((result) => {
                    if (result !== false) {
                        this.hanghoa.hanghoadvts = result;
                    }
                });
            }
        };
        this.subscriptions.add(
            this.giacongService.findDinhMucs().subscribe((x) => {
                this.dataSource_GiaCong = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.donvitinhService.findDonViTinhs().subscribe((x) => {
                this.lstDonViTinh = x;
                this.dataSource_DonViTinh = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
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

    theCallbackValid(params) {
        return this.hanghoaService.checkExistHangHoa(params.value);
    }

    onSubmitForm(e) {
        if(this.hanghoa.dinhmuc_giacong.length >= 2){
            custom({messageHtml: 'Vui lòng chỉ chọn 1 gia công', showTitle: false}).show();
            return;
        }
        if (!this.frmHangHoa.instance.validate().isValid) return;

        let hanghoa_req = this.hanghoa;
        hanghoa_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.hanghoaService.addHangHoa(hanghoa_req).subscribe(
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
                    this.router.navigate(['/hang-hoa-nguyen-lieu']); // chuyển trang sau khi thêm
                    this.frmHangHoa.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.hanghoaService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
