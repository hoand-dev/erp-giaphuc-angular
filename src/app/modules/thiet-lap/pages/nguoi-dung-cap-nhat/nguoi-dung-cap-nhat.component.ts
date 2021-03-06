import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, NguoiDung, NguoiDung_NhomKhachHang, NhomKhachHang } from '@app/shared/entities';
import { NguoiDungService, NhomKhachHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import _ from 'lodash';
import ArrayStore from 'devextreme/data/array_store';

@Component({
    selector: 'app-nguoi-dung-cap-nhat',
    templateUrl: './nguoi-dung-cap-nhat.component.html',
    styleUrls: ['./nguoi-dung-cap-nhat.component.css']
})
export class NguoiDungCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmNguoiDung: DxFormComponent;

    private subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public nguoidung: NguoiDung;
    public username_old: string;
    public saveProcessing = false;

    public popupVisible = false;
    public lstGioiTinh: any[] = ['Nam', 'Nữ'];

    
    public nhomkhachhangs: NhomKhachHang[] = [];
    public dataSource_NhomKhachHang: DataSource;
    public lstNhomKhachHang: NhomKhachHang[] = [];


    public permissionSelected: any[] = [];
    public dataSource_Permission: DataSource;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService, private nguoidungService: NguoiDungService, private nhomkhachhangService: NhomKhachHangService) {}

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
                    // paginate: true,
                    // pageSize: 4,
                    group: (value) => {
                        return value.tenquyencha;
                    }
                });
            })
        );
        this.subscriptions.add(
            this.nhomkhachhangService.findNhomKhachHangs().subscribe((x) => {
             //   this.loadingVisible = false;
                this.lstNhomKhachHang = x;
                this.dataSource_NhomKhachHang = new DataSource({
                    store: x,
                    paginate: true,
                    pageSize: 50
                });
            })
        );
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let nguoidung_id = params.id;
                if (nguoidung_id) {
                    this.subscriptions.add(
                        this.nguoidungService.findNguoiDung(nguoidung_id).subscribe(
                            (data) => {
                                this.nguoidung = data;
                                this.username_old = this.nguoidung.username;

                                let nhomkhachhangs: number[] = [];
                                this.nguoidung.nguoidung_nhomkhachhangs.forEach(x => {
                                    nhomkhachhangs.push(x.nhomkhachhang_id);
                                });
                                this.nguoidung.nhomkhachhangs = nhomkhachhangs;

                                this.permissionSelected = this.nguoidung.permission_codes !== null && this.nguoidung.permission_codes !== '' ? this.nguoidung.permission_codes.split(',') : [];
                            },
                            (error) => {
                                this.nguoidungService.handleError(error);
                            }
                        )
                    );
                }
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
        return this.nguoidungService.checkNguoiDungExist(params.value, this.username_old);
    }

    passwordComparison = () => {
        return this.nguoidung.password;
    };

    onSubmitForm(e) {
        if (!this.frmNguoiDung.instance.validate().isValid) return;

        let nguoidung_req = this.nguoidung;
        nguoidung_req.chinhanh_id = this.currentChiNhanh.id;

        
        let nguoidung_nhomkhachhangs: NguoiDung_NhomKhachHang[] = [];
        this.nguoidung.nhomkhachhangs.forEach(x => {
            let item: NguoiDung_NhomKhachHang = new NguoiDung_NhomKhachHang();
            item.nguoidung_id = this.nguoidung.id;
            item.nhomkhachhang_id = x;

            nguoidung_nhomkhachhangs.push(item);
        });
        this.nguoidung.nguoidung_nhomkhachhangs = nguoidung_nhomkhachhangs;


        this.saveProcessing = true;
        this.subscriptions.add(
            this.nguoidungService.updateNguoiDung(nguoidung_req).subscribe(
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
