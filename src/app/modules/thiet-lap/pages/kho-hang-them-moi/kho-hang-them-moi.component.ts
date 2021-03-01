import { ChiNhanh, KhoHang, KhuVuc } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { KhoHangService, KhuVucService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'app-kho-hang-them-moi',
    templateUrl: './kho-hang-them-moi.component.html',
    styleUrls: ['./kho-hang-them-moi.component.css']
})
export class KhoHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmKhoHang: DxFormComponent;

    /* tối ưu subscriptions */
    public subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public khohang: KhoHang;

    public lstKhuVuc: KhuVuc[] = [];
    public dataSource_KhuVuc: DataSource;

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
        private khuvucService: KhuVucService,
        private khohangService: KhoHangService,
        private authenticationService: AuthenticationService
    ) {}

    ngAfterViewInit() {
        // this.frmKhoHang.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.khohang = new KhoHang();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.khuvucService.findKhuVucs().subscribe((x) => {
                this.lstKhuVuc = x;

                this.dataSource_KhuVuc = new DataSource({
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
        return this.khohangService.checkExistKhoHang(params.value);
    }

    onSubmitForm(e) {
        if (!this.frmKhoHang.instance.validate().isValid) return;

        let khohang_req = this.khohang;
        khohang_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.khohangService.addKhoHang(khohang_req).subscribe(
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
                    this.router.navigate(['/kho-hang']); // chuyển trang sau khi thêm
                    this.frmKhoHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.khohangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
