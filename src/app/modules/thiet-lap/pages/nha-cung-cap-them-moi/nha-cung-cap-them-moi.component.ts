import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh, NhaCungCap, NhaCungCap_SoTaiKhoan, NhomNhaCungCap } from '@app/shared/entities';
import { NhaCungCapService, NhomNhaCungCapService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'app-nha-cung-cap-them-moi',
    templateUrl: './nha-cung-cap-them-moi.component.html',
    styleUrls: ['./nha-cung-cap-them-moi.component.css']
})
export class NhaCungCapThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmNhaCungCap: DxFormComponent;

    /*tối ưu subscription */

    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public nhacungcap: NhaCungCap;
    public lstNhomNhaCungCap: NhomNhaCungCap[] = [];

    public dataSource_NhomNhaCungCap: DataSource;

    public saveProcessing = false;
    public loadingVisible = true;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'sucess',
        useSubmitBehavior: true
    };

    public sotaikhoans: NhaCungCap_SoTaiKhoan[] = [];

    dataSource_SoTaiKhoan: any = {};

    constructor(private router: Router, private authenticationService: AuthenticationService, private nhomnhacungcapService: NhomNhaCungCapService, private nhacungcapService: NhaCungCapService) {}

    ngAfterViewInit() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.nhacungcap = new NhaCungCap();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
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
        let rowsNull = this.sotaikhoans.filter((x) => x.nhacungcap_id == null);
        if (rowsNull.length == 0) {
            this.onAddSoTaiKhoan();
        }
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(param) {
        return this.nhacungcapService.checkExistNhaCungCap(param.value);
    }

    onAddSoTaiKhoan() {
        this.sotaikhoans.push(new NhaCungCap_SoTaiKhoan());
    }

    onDeleteSoTaiKhoan(item) {
        this.sotaikhoans = this.sotaikhoans.filter(function (i) {
            return i !== item;
        });
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
            this.nhacungcapService.addNhaCungCap(nhacungcap_req).subscribe(
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
                    this.frmNhaCungCap.instance.resetValues();
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
