import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, KhoHang, KhuVuc } from '@app/shared/entities';
import { KhoHangService, KhuVucService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
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
    subscriptions: Subscription = new Subscription();
    
    private currentChiNhanh: ChiNhanh;
    public lstKhuVuc: KhuVuc[] = [];
    public khohang: KhoHang;
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
        private khuvucService: KhuVucService,
        private khohangService: KhoHangService, 
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this.khohang = new KhoHang();
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let khohang_id = params.id;
            // lấy thông tin kho hàng
            if (khohang_id) {
                this.subscriptions.add(this.khohangService.findKhoHang(khohang_id).subscribe(
                    data => {
                        this.khohang = data[0];
                    },
                    error => {
                        this.khohangService.handleError(error);
                    }
                ));
                this.subscriptions.add(
                    this.khuvucService.findKhuVucs().subscribe(
                        data => {
                            this.lstKhuVuc = data;
                            // tìm thông tin khu vực theo khuvuc_id                            
                            this.khohang.khuvuc = data.find(o => o.id == this.khohang.khuvuc_id);; // set trước dữ liệu khu vực
                        })
                );
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
        // giả sử mã kho hàng lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let khohang_req = this.khohang;
        khohang_req.chinhanh_id = this.currentChiNhanh.id;
        khohang_req.khuvuc_id = khohang_req.khuvuc.id; // set lại khuvuc_id

        this.saveProcessing = true;
        this.subscriptions.add(this.khohangService.updateKhoHang(khohang_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/kho-hang']);
                // this.frmKhoHang.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.khohangService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}