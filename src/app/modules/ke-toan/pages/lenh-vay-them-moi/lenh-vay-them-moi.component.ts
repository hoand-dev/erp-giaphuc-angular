import { ChiNhanh, LenhVay } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';

import notify from 'devextreme/ui/notify';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';

import { AppInfoService, CommonService, QuyTaiKhoanService, LenhVayService, RouteInterceptorService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

import { QuyTaiKhoan } from '@app/shared/entities';

@Component({
    selector: 'app-lenh-vay-them-moi',
    templateUrl: './lenh-vay-them-moi.component.html',
    styleUrls: ['./lenh-vay-them-moi.component.css']
})
export class LenhVayThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmLenhVay: DxFormComponent;

    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public lenhvay: LenhVay;

    public lstQuyTaiKhoan: QuyTaiKhoan[] = [];
    public dataSource_QuyTaiKhoan: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

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

        private lenhvayService: LenhVayService,
        private quytaikhoanService: QuyTaiKhoanService,
    ) {}

    ngAfterViewInit() {
        // this.frmLenhVay.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.lenhvay = new LenhVay();

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
                this.subscriptions.add(
                    this.quytaikhoanService.findQuyTaiKhoans(x.id).subscribe((x) => {
                        this.loadingVisible = false;
                        this.lstQuyTaiKhoan = x;

                        this.dataSource_QuyTaiKhoan = new DataSource({
                            store: x,
                            paginate: true,
                            pageSize: 50
                        });
                    })
                );
            })
        );
    }

    ngOnDestroy(): void {
        // ? xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onFormFieldChanged(e) {
        // ? thay đổi quỹ nhận
        if (e.dataField == 'quynhan_id' && e.value !== undefined && e.value !== null) {
        }
    }

    public onSubmitForm(e) {
        if(!this.frmLenhVay.instance.validate().isValid) return;

        let lenhvay_req = this.lenhvay;
        lenhvay_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.lenhvayService.addLenhVay(lenhvay_req).subscribe(
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
                    this.router.navigate(['/lenh-vay']);
                    this.frmLenhVay.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.lenhvayService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
