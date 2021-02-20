import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DanhMucTieuChuan } from '@app/shared/entities';
import { DanhMucTieuChuanService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-tieu-chuan-cap-nhat',
    templateUrl: './danh-muc-tieu-chuan-cap-nhat.component.html',
    styleUrls: ['./danh-muc-tieu-chuan-cap-nhat.component.css']
})
export class DanhMucTieuChuanCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucTieuChuan: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public danhmuctieuchuan: DanhMucTieuChuan;

    public madanhmuctieuchuan_old: string;
    public saveProcessing = false;

    public rules: Object = { 'X': /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: "Lưu lại",
        type: "success",
        useSubmitBehavior: true
    }

    constructor(
        private router: Router, 
        private activatedRoute: ActivatedRoute, 
        private authenticationService: AuthenticationService,
        private danhmuctieuchuanService: DanhMucTieuChuanService
        ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmuctieuchuan = new DanhMucTieuChuan();

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let danhmuctieuchuan_id = params.id;
            // lấy thông tin danh mục tiêu chuẩn
            if (danhmuctieuchuan_id) {
                this.subscriptions.add(this.danhmuctieuchuanService.findDanhMucTieuChuan(danhmuctieuchuan_id).subscribe(
                    data => {
                        this.danhmuctieuchuan = data[0];
                        this.madanhmuctieuchuan_old = this.danhmuctieuchuan.madanhmuctieuchuan;
                    },
                    error => {
                        this.danhmuctieuchuanService.handleError(error);
                    }
                ));
            }
        }));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params){
        return this.danhmuctieuchuanService.checkExistDanhMucTieuChuan(params.value, this.madanhmuctieuchuan_old);
    }

    onSubmitForm(e) {
        let danhmuctieuchuan_req = this.danhmuctieuchuan;
        danhmuctieuchuan_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.danhmuctieuchuanService.updateDanhMucTieuChuan(danhmuctieuchuan_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-tieu-chuan']);
                // this.frmDanhMucTieuChuan.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.danhmuctieuchuanService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}