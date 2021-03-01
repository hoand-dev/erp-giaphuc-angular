import { ChiNhanh, NoiDungThuChi } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import notify from 'devextreme/ui/notify';

import { DxFormComponent } from 'devextreme-angular';

import { NoiDungThuChiService } from '@app/shared/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-noi-dung-thu-chi-them-moi',
    templateUrl: './noi-dung-thu-chi-them-moi.component.html',
    styleUrls: ['./noi-dung-thu-chi-them-moi.component.css']
})
export class NoiDungThuChiThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmNoiDungThuChi: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public noidungthuchi: NoiDungThuChi;
    public lstLoaiThuChi: any[] = ['thu', 'chi'];

    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private noidungthuchiService: NoiDungThuChiService) {}

    ngAfterViewInit() {
        // this.frmNoiDungThuChi.instance.validate(); // showValidationSummary sau khi focus out
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.noidungthuchi = new NoiDungThuChi();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.noidungthuchiService.checkExistNoiDungThuChi(params.value);
    }

    onSubmitForm(e) {
        if (!this.frmNoiDungThuChi.instance.validate().isValid) return;

        let noidungthuchi_req = this.noidungthuchi;
        noidungthuchi_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.noidungthuchiService.addNoiDungThuChi(noidungthuchi_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: 'Lưu thành công',
                            position: { my: 'right top', at: 'right top' }
                        },
                        'success',
                        475
                    );
                    this.router.navigate(['/noi-dung-thu-chi']); // chuyển trang sau khi thêm
                    this.frmNoiDungThuChi.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.noidungthuchiService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
