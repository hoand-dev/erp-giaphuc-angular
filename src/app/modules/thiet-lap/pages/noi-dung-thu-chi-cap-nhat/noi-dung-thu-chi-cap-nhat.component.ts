import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, NoiDungThuChi } from '@app/shared/entities';
import { NoiDungThuChiService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-noi-dung-thu-chi-cap-nhat',
    templateUrl: './noi-dung-thu-chi-cap-nhat.component.html',
    styleUrls: ['./noi-dung-thu-chi-cap-nhat.component.css']
})
export class NoiDungThuChiCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmNoiDungThuChi: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public noidungthuchi: NoiDungThuChi;
    public saveProcessing = false;
    
    public manoidungthuchi_old: string;
    public lstLoaiThuChi: any[] = ["thu", "chi"];
    
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
        private noidungthuchiService: NoiDungThuChiService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.noidungthuchi = new NoiDungThuChi();

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let noidungthuchi_id = params.id;
            // lấy thông tin nội dung thu chi
            if (noidungthuchi_id) {
                this.subscriptions.add(this.noidungthuchiService.findNoiDungThuChi(noidungthuchi_id).subscribe(
                    data => {
                        this.noidungthuchi = data[0];
                        this.manoidungthuchi_old = this.noidungthuchi.manoidungthuchi;
                    },
                    error => {
                        this.noidungthuchiService.handleError(error);
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
        return this.noidungthuchiService.checkExistNoiDungThuChi(params.value, this.manoidungthuchi_old);
    }

    onSubmitForm(e) {
        if(!this.frmNoiDungThuChi.instance.validate().isValid) return;
        
        let noidungthuchi_req = this.noidungthuchi;
        noidungthuchi_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.noidungthuchiService.updateNoiDungThuChi(noidungthuchi_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/noi-dung-thu-chi']);
                // this.frmNoiDungThuChi.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.noidungthuchiService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}