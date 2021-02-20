import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChiNhanh, SoMat } from '@app/shared/entities';
import { DanhSachXe } from '@app/shared/entities/thiet-lap/danh-sach-xe';
import { DanhSachXeService } from '@app/shared/services';
import { AuthenticationService } from '@app/_services';
import { DxFormComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-danh-sach-xe-cap-nhat',
  templateUrl: './danh-sach-xe-cap-nhat.component.html',
  styleUrls: ['./danh-sach-xe-cap-nhat.component.css']
})
export class DanhSachXeCapNhatComponent implements OnInit {
    @ViewChild(DxFormComponent, { static: false }) frmSoMat: DxFormComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    private currentChiNhanh: ChiNhanh;
    
    public danhsachxe: DanhSachXe;
    public saveProcessing = false;
    public danhsachxe_old : string;

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
        private danhsachxeService: DanhSachXeService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.authenticationService.setDisableChiNhanh(true);
        });
        this.danhsachxe = new DanhSachXe();
        this.theCallbackValid = this.theCallbackValid.bind(this); // binding function sang html sau compile


        // danh sách xe là tên bảng --> kiểm tra biển số xe trùng
        this.subscriptions.add(this.authenticationService.currentChiNhanh.subscribe(x => this.currentChiNhanh = x));
        this.subscriptions.add(this.activatedRoute.params.subscribe(params => {
            let danhsachxe_id = params.id;
            // lấy thông tin danh sách xe
            if (danhsachxe_id) {
                this.subscriptions.add(this.danhsachxeService.findDanhSachXe(danhsachxe_id).subscribe(
                    data => {
                        this.danhsachxe = data[0];
                        this.danhsachxe_old = this.danhsachxe.biensoxe;
                    },
                    error => {
                        this.danhsachxeService.handleError(error);
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

    theCallbackValid(params) {
        return this.danhsachxeService.checkDanhSachXeExist(params.value, this.danhsachxe_old);
    }

 

    onSubmitForm(e) {
        let danhsachxe_req = this.danhsachxe;
        danhsachxe_req.chinhanh_id = this.currentChiNhanh.id;
        
        this.saveProcessing = true;
        this.subscriptions.add(this.danhsachxeService.updateDanhSachXe(danhsachxe_req).subscribe(
            data => {
                notify({
                    width: 320,
                    message: "Lưu thành công",
                    position: { my: "right top", at: "right top" }
                }, "success", 475);
                this.router.navigate(['/danh-sach-xe']);
                // this.frmSoMat.instance.resetValues();
                this.saveProcessing = false;
            },
            error => {
                this.danhsachxeService.handleError(error);
                this.saveProcessing = false;
            }
        ));
        e.preventDefault();
    }

}
