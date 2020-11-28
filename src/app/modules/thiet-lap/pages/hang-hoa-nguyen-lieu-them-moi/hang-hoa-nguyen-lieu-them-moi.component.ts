import { ChiNhanh, DonViTinh, HangHoa } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, DonViTinhService, HangHoaService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import DataSource from 'devextreme/data/data_source';

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

    public lstDonViTinh: DonViTinh[] = [];
    public dataSource_DonViTinh: DataSource;

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        public appInfoService: AppInfoService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private hanghoaService: HangHoaService,
        private donvitinhService: DonViTinhService
    ) {}

    ngAfterViewInit() {
        // this.frmHangHoa.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.hanghoa = new HangHoa();
        this.hanghoa.loaihanghoa = this.appInfoService.loaihanghoa_nguyenlieu;

        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
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
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.hanghoaService.checkExistHangHoa(params.value);
    }

    onSubmitForm(e) {
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
