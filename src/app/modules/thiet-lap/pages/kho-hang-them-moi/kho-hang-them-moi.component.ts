import { ChiNhanh, KhoHang, KhuVuc } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { KhoHangService, KhuVucService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-kho-hang-them-moi',
    templateUrl: './kho-hang-them-moi.component.html',
    styleUrls: ['./kho-hang-them-moi.component.css']
})
export class KhoHangThemMoiComponent implements OnInit {

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

    ngAfterViewInit() {
        // this.frmKhoHang.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.khohang = new KhoHang();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(
            this.khuvucService.findKhuVucs().subscribe(
                x => {
                    this.lstKhuVuc = x;
                    // this.khohang.khuvuc = null; // set trước dữ liệu khu vực
                })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params){	
        return this.khohangService.checkExistKhoHang(params.value);
    }

    onSubmitForm(e) {
        let khohang_req = this.khohang;
        khohang_req.chinhanh_id = this.currentChiNhanh.id;
        khohang_req.khuvuc_id = khohang_req.khuvuc.id; // set lại khuvuc_id

        this.saveProcessing = true;
        this.subscriptions.add(this.khohangService.addKhoHang(khohang_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/kho-hang']); // chuyển trang sau khi thêm
                this.frmKhoHang.instance.resetValues();
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