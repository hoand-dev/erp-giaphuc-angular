import { ChiNhanh } from '@app/shared/entities';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import {
    DxFormComponent
} from 'devextreme-angular';

import { ChiNhanhService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chi-nhanh-them-moi',
    templateUrl: './chi-nhanh-them-moi.component.html',
    styleUrls: ['./chi-nhanh-them-moi.component.css']
})
export class ChiNhanhThemMoiComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmChiNhanh: DxFormComponent;

    private subscription: Subscription;
    public chinhanh: ChiNhanh;

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
        private chinhanhService: ChiNhanhService
    ) { }

    ngAfterViewInit() {
        // this.frmChiNhanh.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        this.chinhanh = new ChiNhanh();
        this.theCallbackValid = this.theCallbackValid.bind(this); // binding function sang html sau compile
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        if (this.subscription)
            this.subscription.unsubscribe();
    }
    
    theCallbackValid(params){
        return this.chinhanhService.checkExistChiNhanh(params.value);
    }

    onSubmitForm(e) {
        let chinhanh_req = this.chinhanh;

        this.saveProcessing = true;
        this.subscription = this.chinhanhService.addChiNhanh(chinhanh_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/chi-nhanh']); // chuyển trang sau khi thêm
                this.frmChiNhanh.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.chinhanhService.handleError(error);
                this.saveProcessing = false;
            }
        );
        e.preventDefault();
    }
}
