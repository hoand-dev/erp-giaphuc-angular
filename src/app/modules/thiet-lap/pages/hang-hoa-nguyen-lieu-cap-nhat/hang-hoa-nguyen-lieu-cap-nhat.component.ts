import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, DonViTinh, HangHoa } from '@app/shared/entities';
import { DonViTinhService, HangHoaService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-hang-hoa-nguyen-lieu-cap-nhat',
    templateUrl: './hang-hoa-nguyen-lieu-cap-nhat.component.html',
    styleUrls: ['./hang-hoa-nguyen-lieu-cap-nhat.component.css']
})
export class HangHoaNguyenLieuCapNhatComponent implements OnInit, OnDestroy {

    @ViewChild(DxFormComponent, { static: false }) frmHangHoa: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;

    public lstDonViTinh: DonViTinh[] = [];
    public hanghoa: HangHoa;
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
        private hanghoaService: HangHoaService,
        private donvitinhService: DonViTinhService
    ) { }

    ngOnInit(): void {
        this.hanghoa = new HangHoa();

        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let hanghoa_id = params.id;
            // lấy thông tin nguyên liệu
            if (hanghoa_id) {
                this.subscriptions.add(this.hanghoaService.findHangHoa(hanghoa_id).subscribe(
                    data => {
                        this.hanghoa = data[0];
                    },
                    error => {
                        this.hanghoaService.handleError(error);
                    }
                ));
                this.subscriptions.add(
                    this.donvitinhService.findDonViTinhs().subscribe(
                        x => {
                            this.lstDonViTinh = x;
                            this.hanghoa.donvitinh = x.find(o => o.id == this.hanghoa.dvt_id);
                        })
                );
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
        // giả sử mã nguyên liệu lấy dc từ api true (đã tồn tại)
        if (params.value == "ssss") {
            return false;
        }
        return true;
    }

    onSubmitForm(e) {
        let hanghoa_req = this.hanghoa;
        hanghoa_req.chinhanh_id = this.currentChiNhanh.id;
        hanghoa_req.dvt_id = hanghoa_req.donvitinh.id;

        this.saveProcessing = true;
        this.subscriptions.add(this.hanghoaService.updateHangHoa(hanghoa_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/hang-hoa-nguyen-lieu']);
                // this.frmHangHoa.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.hanghoaService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }
}