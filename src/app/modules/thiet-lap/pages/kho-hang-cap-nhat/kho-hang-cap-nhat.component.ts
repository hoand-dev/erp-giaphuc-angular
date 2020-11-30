import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, KhoHang, KhuVuc } from '@app/shared/entities';
import { KhoHangService, KhuVucService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-kho-hang-cap-nhat',
    templateUrl: './kho-hang-cap-nhat.component.html',
    styleUrls: ['./kho-hang-cap-nhat.component.css']
})
export class KhoHangCapNhatComponent implements OnInit, OnDestroy {
    @ViewChild(DxFormComponent, { static: false }) frmKhoHang: DxFormComponent;

    /* tối ưu subscriptions */
    public subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    public khohang: KhoHang;

    public lstKhuVuc: KhuVuc[] = [];
    public dataSource_KhuVuc: DataSource;
    
    public makhohang_old: string;
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

    ngOnInit(): void {
        this.khohang = new KhoHang();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh.subscribe((x) => {
                this.currentChiNhanh = x;
            })
        );

        this.subscriptions.add(
            this.khuvucService.findKhuVucs().subscribe((data) => {
                this.lstKhuVuc = data;

                this.dataSource_KhuVuc = new DataSource({
                    store: data,
                    paginate: true,
                    pageSize: 50
                });
            })
        );

        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let khohang_id = params.id;
                // lấy thông tin kho hàng
                if (khohang_id) {
                    this.subscriptions.add(
                        this.khohangService.findKhoHang(khohang_id).subscribe(
                            (data) => {
                                this.khohang = data[0];
                                this.makhohang_old = this.khohang.makhohang;
                            },
                            (error) => {
                                this.khohangService.handleError(error);
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
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.khohangService.checkExistKhoHang(params.value, this.makhohang_old);
    }

    onSubmitForm(e) {
        let khohang_req = this.khohang;
        khohang_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.khohangService.updateKhoHang(khohang_req).subscribe(
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
                    this.router.navigate(['/kho-hang']);
                    // this.frmKhoHang.instance.resetValues();
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
