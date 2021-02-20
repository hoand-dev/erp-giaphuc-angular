import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, SoMat } from '@app/shared/entities';
import { SoMatService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-so-mat-cap-nhat',
    templateUrl: './so-mat-cap-nhat.component.html',
    styleUrls: ['./so-mat-cap-nhat.component.css']
})
export class SoMatCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmSoMat: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public somat: SoMat;
    public saveProcessing = false;

    public masomat_old: string;

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
        private somatService: SoMatService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.somat = new SoMat();
        this.theCallbackValid = this.theCallbackValid.bind(this);

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let somat_id = params.id;
            // lấy thông tin số mặt
            if (somat_id) {
                this.subscriptions.add(this.somatService.findSoMat(somat_id).subscribe(
                    data => {
                        this.somat = data[0];
                        this.masomat_old = this.somat.masomat;
                    },
                    error => {
                        this.somatService.handleError(error);
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
        return this.somatService.checkExistSoMat(params.value, this.masomat_old);
    }

    onSubmitForm(e) {
        let somat_req = this.somat;
        somat_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.somatService.updateSoMat(somat_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/so-mat']);
                // this.frmSoMat.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.somatService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}