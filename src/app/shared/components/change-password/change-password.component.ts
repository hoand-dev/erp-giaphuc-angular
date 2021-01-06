import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';
import { NguoiDungService } from '@app/shared/services';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    private subscriptions: Subscription = new Subscription();
    public onClose: Subject<any>;
    public title: string;
    public closeBtnName: string;

    public dataChange: { crr_pass: string; new_pass: string; req_pass: string } = { crr_pass: '', new_pass: '', req_pass: '' };

    constructor(public bsModalRef: BsModalRef, private authenticationService: AuthenticationService, private nguoidungService: NguoiDungService) {}

    ngOnInit(): void {
        this.onClose = new Subject();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onConfirm(): void {
        if (this.dataChange.new_pass != this.dataChange.req_pass) {
            Swal.fire('Mật khẩu chưa khớp!', 'Mật khẩu nhập lại chưa khớp', 'warning');
            return;
        }

        this.subscriptions.add(
            this.nguoidungService.changePassword(this.dataChange.crr_pass, this.dataChange.new_pass).subscribe(
                (data) => {
                    if (data) {
                        Swal.fire('Hoàn tất!', 'Mật khẩu đã được cập nhật.', 'success');
                        this.onClose.next(true);
                        this.bsModalRef.hide();
                    }
                },
                (error) => {
                    this.nguoidungService.handleError(error);
                }
            )
        );
    }

    public onCancel(): void {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
