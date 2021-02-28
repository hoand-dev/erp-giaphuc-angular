import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh } from '@app/shared/entities';
import { TaiXe } from '@app/shared/entities/thiet-lap/tai-xe';
import { AuthenticationService } from '@app/_services/authentication.service';
import { DxDataGridComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { TaiXeService } from '@app/shared/services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-tai-xe-cap-nhat',
    templateUrl: './tai-xe-cap-nhat.component.html',
    styleUrls: ['./tai-xe-cap-nhat.component.css']
})
export class TaiXeCapNhatComponent implements OnInit {
    @ViewChild(DxDataGridComponent, { static: false }) frmTaiXe: DxDataGridComponent;
    /* Tối ưu subsriptions  */

    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public taixe: TaiXe;
    public saveProcessing = false;
    taixe_old: string;

    public rules: Object = { X: /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService, private taixeService: TaiXeService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.taixe = new TaiXe();
        this.theCallbackValid = this.theCallbackValid.bind(this); // lấy thông tin củ

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let taixe_id = params.id;
                //lấy thông tin tài Xế
                if (taixe_id) {
                    this.subscriptions.add(
                        this.taixeService.findTaiXe(taixe_id).subscribe(
                            (data) => {
                                this.taixe = data[0];
                                this.taixe_old = this.taixe.mataixe; // gán lại dữ liệu đã tồn tại
                            },
                            (error) => {
                                this.taixeService.handleError(error);
                            }
                        )
                    );
                }
            })
        );
    }

    ngOnDestroy(): void {
        //xử lý trước khi thoát khỏi trang ng
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.taixeService.checkTaiXeExist(params.value, this.taixe_old);
    }

    onSubmitForm(e) {
        if(!this.frmTaiXe.instance.validate().isValid) return;
        
        let taixe_req = this.taixe;
        taixe_req.chinhanh_id = this.currentChiNhanh.id;

        this.saveProcessing = true;
        this.subscriptions.add(
            this.taixeService.updateTaiXe(taixe_req).subscribe(
                (data) => {
                    notify(
                        {
                            width: 320,
                            message: 'lưu thành công',
                            position: { my: 'right top', at: 'right top' }
                        },
                        'success',
                        475
                    );
                    this.router.navigate(['/tai-xe']);
                    this.saveProcessing = false;
                },
                (error) => {
                    this.taixeService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
