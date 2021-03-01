import { ChiNhanh, KhuVuc } from '@app/shared/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { KhuVucService } from '@app/shared/services';
import notify from 'devextreme/ui/notify';

@Component({
    selector: 'app-khu-vuc-cap-nhat',
    templateUrl: './khu-vuc-cap-nhat.component.html',
    styleUrls: ['./khu-vuc-cap-nhat.component.css']
})
export class KhuVucCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmKhuVucCapNhat: DxFormComponent;

    /* tối ưu subscriptions*/

    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public khuvuc: KhuVuc;
    public khuvuc_old: string;
    public saveProcessing = false;

    public rules: Object = { X: /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'submit',
        useSubmitBehavior: true
    };

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService, private khuvucService: KhuVucService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.khuvuc = new KhuVuc();
        this.theCallbackValid = this.theCallbackValid.bind(this); // binding function sang html sau compile

        //danh sách khu vực là tên khu vực --> kiểm tra khu vực trùng
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe((x) => (this.currentChiNhanh = x)));
        this.subscriptions.add(
            this.activatedRoute.params.subscribe((params) => {
                let khuvuc_id = params.id;
                // lấy danh sách khu Vực
                if (khuvuc_id) {
                    this.subscriptions.add(
                        this.khuvucService.findKhuVuc(khuvuc_id).subscribe(
                            (data) => {
                                this.khuvuc = data[0];
                                this.khuvuc_old = this.khuvuc.makhuvuc;
                            },
                            (error) => {
                                this.khuvucService.handleError(error);
                            }
                        )
                    );
                }
            })
        );
    }

    ngOnDestroy() {
        // called once before the instance is destroyed
        //xử lý trước khi thoát khỏi trang
        this.authenticationService.setDisableChiNhanh(false);
        this.subscriptions.unsubscribe();
    }

    theCallbackValid(params) {
        return this.khuvucService.checkKhuVucExist(params.value, this.khuvuc_old);
    }
    // KHÔNG GIẬN KHÔNG HỜN KHÔNG OÁN TRÁCH

    onSubmitForm(e) {
        if (!this.frmKhuVucCapNhat.instance.validate().isValid) return;

        let khuvuc_req = this.khuvuc; //
        khuvuc_req.chinhanh_id = this.currentChiNhanh.id; //

        this.saveProcessing = true;
        this.subscriptions.add(
            this.khuvucService.updateKhuVuc(khuvuc_req).subscribe(
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
                    this.router.navigate(['/khu-vuc']);
                    this.saveProcessing = false;
                },
                (error) => {
                    this.khuvucService.handleError(error);
                    this.saveProcessing = false;
                }
            )
        );
        e.preventDefault();
    }
}
