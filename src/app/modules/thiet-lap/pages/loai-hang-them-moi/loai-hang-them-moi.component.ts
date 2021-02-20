import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChiNhanh, LoaiHang } from '@app/shared/entities';
import { LoaiHangService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-loai-hang-them-moi',
    templateUrl: './loai-hang-them-moi.component.html',
    styleUrls: ['./loai-hang-them-moi.component.css']
})
export class LoaiHangThemMoiComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmLoaiHang: DxFormComponent;

    /*tối ưu subscriptions*/

    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public loaihang: LoaiHang;
    public saveProcessing = false;

    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private authenticationService: AuthenticationService, private loaihangService: LoaiHangService) {}

    ngAfterViewInit() {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.loaihang = new LoaiHang();
        this.theCallbackValid = this.theCallbackValid.bind(this);
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
    }

    theCallbackValid(params) {
        return this.loaihangService.checkLoaiHangExist(params.value);
    }

    ngOnDestroy(): void {
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    onSubmitForm(e) {
        let loaihang_req = this.loaihang;
        loaihang_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.loaihangService.addLoaiHang(loaihang_req).subscribe(
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
                    this.router.navigate(['/loai-hang']);
                    this.frmLoaiHang.instance.resetValues();
                    this.saveProcessing = false;
                },
                (error) => {
                    this.loaihangService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
