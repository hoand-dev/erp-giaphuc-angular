import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DonViGiaCong, KhoHang } from '@app/shared/entities';
import { DonViGiaCongService, KhoHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-don-vi-gia-cong-cap-nhat',
    templateUrl: './don-vi-gia-cong-cap-nhat.component.html',
    styleUrls: ['./don-vi-gia-cong-cap-nhat.component.css']
})
export class DonViGiaCongCapNhatComponent implements OnInit, OnDestroy {
    @ViewChild(DxFormComponent, { static: false }) frmDonViGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public donvigiacong: DonViGiaCong;

    public lstKhoHang: KhoHang[] = [];
    public dataSource_KhoHang: DataSource;

    public madonvigiacong_old: string;
    public saveProcessing = false;

    public rules: Object = { X: /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private khohangService: KhoHangService,
        private donvigiacongService: DonViGiaCongService,
        private authenticationService: AuthenticationService
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.donvigiacong = new DonViGiaCong();

        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.onLoadKhoHang();
            })
        );

        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let donvigiacong_id = params.id;
                // lấy thông tin kho hàng
                if (donvigiacong_id) {
                    this.subscriptions.add(
                        this.donvigiacongService.findDonViGiaCong(donvigiacong_id).subscribe(
                            (data) => {
                                this.donvigiacong = data[0];
                                this.madonvigiacong_old = this.donvigiacong.madonvigiacong;
                                this.donvigiacong.loaidonvi = this.donvigiacong.loaigiacong == 2 ? true : false; // 2: gia công ngoài
                            },
                            (error) => {
                                this.donvigiacongService.handleError(error);
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

    onLoadKhoHang() {
        // khi thêm mới thay đổi chi nhánh thì load lại danh sách kho hàng theo chi nhánh đó
        this.subscriptions.add(
            this.khohangService.findKhoHangs(this.currentChiNhanh.id).subscribe((x) => {
                this.lstKhoHang = x.filter((y) => y.khongoai == this.donvigiacong.loaidonvi);
                this.dataSource_KhoHang = new DataSource({
                    store: this.lstKhoHang,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
    }

    theCallbackValid(params) {
        return this.donvigiacongService.checkExistDonViGiaCong(params.value, this.madonvigiacong_old);
    }

    onFormFieldChanged(e) {
        if (e.dataField == 'loaidonvi' && e.value !== undefined && e.value !== null) {
            this.onLoadKhoHang();
        }
    }

    onSubmitForm(e) {
        if (!this.frmDonViGiaCong.instance.validate().isValid) return;

        let donvigiacong_req = this.donvigiacong;
        donvigiacong_req.chinhanh_id = this.currentChiNhanh.id;
        donvigiacong_req.loaigiacong = this.donvigiacong.loaidonvi ? 2 : 1;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.donvigiacongService.updateDonViGiaCong(donvigiacong_req).subscribe(
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
                    this.router.navigate(['/don-vi-gia-cong']);
                    // this.frmDonViGiaCong.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.donvigiacongService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
