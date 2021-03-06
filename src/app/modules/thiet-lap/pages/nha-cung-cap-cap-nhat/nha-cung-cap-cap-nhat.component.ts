import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChiNhanh, NhaCungCap, NhaCungCap_SoTaiKhoan, NhomNhaCungCap } from '@app/shared/entities';
import { NhaCungCapService, NhomNhaCungCapService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent, DxFormModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nha-cung-cap-cap-nhat',
    templateUrl: './nha-cung-cap-cap-nhat.component.html',
    styleUrls: ['./nha-cung-cap-cap-nhat.component.css']
})
export class NhaCungCapCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmNhaCungCap: DxFormComponent;

    /*tối ưu subscription */

    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public nhacungcap: NhaCungCap;
    public lstNhomNhaCungCap: NhomNhaCungCap[] = [];

    public dataSource_NhomNhaCungCap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public sotaikhoan_old: string;
    public manhacungcap_old: string;

    public sotaikhoans: NhaCungCap_SoTaiKhoan[] = [];

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private nhomnhacungcapService: NhomNhaCungCapService,
        private nhacungcapService: NhaCungCapService
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });

        this.nhacungcap = new NhaCungCap();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let nhacungcap_id = params.id;
                if (nhacungcap_id) {
                    this.subscriptions.add(
                        this.nhacungcapService.findNhaCungCap(nhacungcap_id).subscribe(
                            (data) => {
                                this.nhacungcap = data;
                                this.manhacungcap_old = this.nhacungcap.manhacungcap;
                                this.sotaikhoans = this.nhacungcap.nhacungcap_sotaikhoan;
                            },
                            (error) => {
                                this.nhacungcapService.handleError(error);
                            }
                        )
                    );
                    this.subscriptions.add(
                        this.nhomnhacungcapService.findNhomNhaCungCaps().subscribe((x) => {
                            this.loadingVisible = false;
                            this.lstNhomNhaCungCap = x;
                            this.dataSource_NhomNhaCungCap = new DataSource({
                                store: x,
                                paginate: true,
                                pageSize: 50
                            });
                        })
                    );
                    // this.subscriptions.add(this.sotaikhoans) lay thong tin stk
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.nhacungcapService.checkExistNhaCungCap(params.value, this.manhacungcap_old);
    }
    onAddSoTaiKhoan() {
        this.sotaikhoans.push(new NhaCungCap_SoTaiKhoan());
    }

    onDeleteSoTaiKhoan(item) {
        this.sotaikhoans = this.sotaikhoans.filter(function (i) {
            return i !== item;
        });
    }
    onChangedSoTaiKhoan(i, e) {
        // chỉ thêm row mới khi không tồn tài dòng rỗng nào
        let rowsNull = this.sotaikhoans.filter((x) => x.nhacungcap_id == null);
        if (rowsNull.length == 0) {
            this.onAddSoTaiKhoan();
        }
    }

    onSubmitForm(e) {
        if (!this.frmNhaCungCap.instance.validate().isValid) return;

        let nhacungcap_sotaikhoan = this.sotaikhoans.filter((x) => x.nhacungcap_id != null);
        let nhacungcap_req = this.nhacungcap;

        nhacungcap_req.chinhanh_id = this.currentChiNhanh.id;

        nhacungcap_req.nhomnhacungcap_id = nhacungcap_req.nhomnhacungcap_id;

        nhacungcap_req.nhacungcap_sotaikhoan = this.sotaikhoans;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.nhacungcapService.updateNhaCungCap(nhacungcap_req).subscribe(
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
                    this.router.navigate(['/nha-cung-cap']);
                    //  this.frmNhaCungCap.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.nhacungcapService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
