import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, NguonNhanLuc } from '@app/shared/entities';
import { NguonNhanLucService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-nguon-nhan-luc-cap-nhat',
    templateUrl: './nguon-nhan-luc-cap-nhat.component.html',
    styleUrls: ['./nguon-nhan-luc-cap-nhat.component.css']
})
export class NguonNhanLucCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmNguonNhanLuc: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public nguonnhanluc: NguonNhanLuc;
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
        private nguonnhanlucService: NguonNhanLucService
    ) { }

    ngOnInit(): void {
        this.nguonnhanluc = new NguonNhanLuc();
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let nguonnhanluc_id = params.id;
            // lấy thông tin nguồn nhân lực
            if (nguonnhanluc_id) {
                this.subscriptions.add(this.nguonnhanlucService.findNguonNhanLuc(nguonnhanluc_id).subscribe(
                    data => {
                        this.nguonnhanluc = data[0];
                    },
                    error => {
                        this.nguonnhanlucService.handleError(error);
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
        // giả sử mã nguồn nhân lực lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let nguonnhanluc_req = this.nguonnhanluc;
        nguonnhanluc_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.nguonnhanlucService.updateNguonNhanLuc(nguonnhanluc_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/nguon-nhan-luc']);
                // this.frmNguonNhanLuc.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.nguonnhanlucService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}