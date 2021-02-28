import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh, NguoiDung } from '@app/shared/entities';
import { NguoiDungService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import _ from 'lodash';

@Component({
    selector: 'app-nguoi-dung-them-moi',
    templateUrl: './nguoi-dung-them-moi.component.html',
    styleUrls: ['./nguoi-dung-them-moi.component.css']
})
export class NguoiDungThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmNguoiDung: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public nguoidung: NguoiDung;
    public saveProcessing = false;

    public popupVisible = false;
    public lstGioiTinh: any[] = ['Nam', 'Nữ'];

    public permissionSelected: any[] = [];
    public dataSource_Permission: DataSource;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private nguoidungService: NguoiDungService) {}

    ngAfterViewInit() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.nguoidung = new NguoiDung();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.nguoidungService.getAllPermission().subscribe((x) => {
                this.dataSource_Permission = new DataSource({
                    store: new ArrayStore({
                        key: 'maquyen',
                        data: x.filter((z) => z.maquyencha != null)
                    }),
                    paginate: true,
                    pageSize: 4,
                    group: (value) => {
                        return value.tenquyencha;
                    }
                });
            })
        );
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    showPopup() {
        this.popupVisible = true;
    }

    hidePopup() {
        this.popupVisible = false;
        this.nguoidung.permission_codes = this.permissionSelected.toString();
    }

    theCallbackValid(params) {
        return this.nguoidungService.checkNguoiDungExist(params.value);
    }

    passwordComparison = () => {
        return this.frmNguoiDung.instance.option('formData').password;
    };

    onSubmitForm(e) {
        if(!this.frmNguoiDung.instance.validate().isValid) return;
        
        let nguoidung_req = this.nguoidung;
        nguoidung_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.nguoidungService.addNguoiDung(nguoidung_req).subscribe(
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
                    this.router.navigate(['/nguoi-dung']);
                    this.frmNguoiDung.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.nguoidungService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
