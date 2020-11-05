import { ChiNhanh, DinhMuc } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { DanhMucGiaCongService, DinhMucService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { DanhMucGiaCong } from '../../../../shared/entities/thiet-lap/danh-muc-gia-cong';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HangHoaService } from '../../../../shared/services/thiet-lap/hang-hoa.service';
import { NoiDungThuChiService } from '../../../../shared/services/thiet-lap/noi-dung-thu-chi.service';
import { NguonNhanLucService } from '../../../../shared/services/thiet-lap/nguon-nhan-luc.service';

@Component({
    selector: 'app-dinh-muc-them-moi',
    templateUrl: './dinh-muc-them-moi.component.html',
    styleUrls: ['./dinh-muc-them-moi.component.css']
})
export class DinhMucThemMoiComponent implements OnInit {

    @ViewChild(DxFormComponent, { static: false }) frmDinhMuc: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public dinhmuc: DinhMuc;
    public lstGiaCong: DanhMucGiaCong[] = [];

    public saveProcessing = false;
    public loadingVisible = true;

    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    public hanghoas: { select_id: number }[] = [
        { select_id: 207904 },
        { select_id: 207904 },
    ];
    public nguonlucs: any[];
    public chiphikhacs: any[];

    dataSource_HangHoa: any = {};
    dataSource_NguonLuc: any = {};
    dataSource_ChiPhiKhac: any = {};

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private giacongService: DanhMucGiaCongService,
        private dinhmucService: DinhMucService,
        private hanghoaService: HangHoaService,
        private noidungchiService: NoiDungThuChiService,
        private nguonnhanlucService: NguonNhanLucService
    ) { }

    onHangHoaChanged(i, e) {

    }
    onNguonLucChanged(i, e) {

    }
    onChiPhiKhacChanged(i, e) {

    }
    
    ngAfterViewInit() {
        // this.frmDinhMuc.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.dinhmuc = new DinhMuc();
        
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(
            this.giacongService.findDanhMucGiaCongs().subscribe(
                x => {
                    this.loadingVisible = false;
                    this.lstGiaCong = x;
                })
        );
        this.loadingVisible = true;
        this.subscriptions.add(
            this.hanghoaService.findHangHoas().subscribe(
                x => {
                    this.loadingVisible = false;
                    this.dataSource_HangHoa = new DataSource({
                        store: x, paginate: true, pageSize: 50
                    });
                }
            )
        );
        this.loadingVisible = true;
        this.subscriptions.add(
            this.nguonnhanlucService.findNguonNhanLucs().subscribe(
                x => {
                    this.loadingVisible = false;
                    this.dataSource_NguonLuc = new DataSource({
                        store: x, paginate: true, pageSize: 50
                    });
                }
            )
        );
        this.loadingVisible = true;
        this.subscriptions.add(
            this.noidungchiService.findNoiDungThuChis().subscribe(
                x => {
                    this.loadingVisible = false;
                    this.dataSource_ChiPhiKhac = new DataSource({
                        store: x, paginate: true, pageSize: 50
                    });
                }
            )
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã định mức lấy dc từ api true (đã tồn tại) là "ssss"
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let dinhmuc_req = this.dinhmuc;
        dinhmuc_req.chinhanh_id = this.currentChiNhanh.id;
        dinhmuc_req.danhmucgiacong_id = dinhmuc_req.giacong.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.dinhmucService.addDinhMuc(dinhmuc_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/dinh-muc']); // chuyển trang sau khi thêm
                this.frmDinhMuc.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.dinhmucService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}