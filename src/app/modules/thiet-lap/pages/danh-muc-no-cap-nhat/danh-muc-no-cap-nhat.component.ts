import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DanhMucNo } from '@app/shared/entities';
import { DanhMucNoService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-danh-muc-no-cap-nhat',
    templateUrl: './danh-muc-no-cap-nhat.component.html',
    styleUrls: ['./danh-muc-no-cap-nhat.component.css']
})
export class DanhMucNoCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmDanhMucNo: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public danhmucno: DanhMucNo;

    public madanhmucno_old: string;
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
        private danhmucnoService: DanhMucNoService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhmucno = new DanhMucNo();

        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let danhmucno_id = params.id;
            // lấy thông tin danh mục nợ
            if (danhmucno_id) {
                this.subscriptions.add(this.danhmucnoService.findDanhMucNo(danhmucno_id).subscribe(
                    data => {
                        this.danhmucno = data[0];
                        this.madanhmucno_old = this.danhmucno.madanhmucno;
                    },
                    error => {
                        this.danhmucnoService.handleError(error);
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
        return this.danhmucnoService.checkExistDanhMucNo(params.value, this.madanhmucno_old);
    }

    onSubmitForm(e) {
        if(!this.frmDanhMucNo.instance.validate().isValid) return;
        
        let danhmucno_req = this.danhmucno;
        danhmucno_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.danhmucnoService.updateDanhMucNo(danhmucno_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-muc-no']);
                // this.frmDanhMucNo.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.danhmucnoService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}