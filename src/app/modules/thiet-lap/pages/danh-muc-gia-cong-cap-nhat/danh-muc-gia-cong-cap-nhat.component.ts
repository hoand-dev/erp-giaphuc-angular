import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DanhMucGiaCong } from '@app/shared/entities';
import { DanhMucGiaCongService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-gia-cong-cap-nhat',
    templateUrl: './danh-muc-gia-cong-cap-nhat.component.html',
    styleUrls: ['./danh-muc-gia-cong-cap-nhat.component.css']
})
export class DanhMucGiaCongCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucGiaCong: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    public danhmucgiacong: DanhMucGiaCong;
    public saveProcessing = false;
    private currentChiNhanh: ChiNhanh;

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
        private danhmucgiacongService: DanhMucGiaCongService
    ) { }

    ngOnInit(): void {
        this.danhmucgiacong = new DanhMucGiaCong();
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let danhmucgiacong_id = params.id;
            // lấy thông tin danh mục gia công
            if (danhmucgiacong_id) {
                this.subscriptions.add(this.danhmucgiacongService.findDanhMucGiaCong(danhmucgiacong_id).subscribe(
                    data => {
                        this.danhmucgiacong = data[0];
                    },
                    error => {
                        this.danhmucgiacongService.handleError(error);
                    }
                ));
            }
        }));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    asyncValidation(params) {
        // giả sử mã danh mục gia công lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let danhmucgiacong_req = this.danhmucgiacong;
        danhmucgiacong_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.danhmucgiacongService.updateDanhMucGiaCong(danhmucgiacong_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-gia-cong']);
                // this.frmDanhMucGiaCong.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.danhmucgiacongService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}
