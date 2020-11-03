import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';
import { ChiNhanhService } from '@app/shared/services/thiet-lap';
import { ChiNhanh } from '@app/shared/entities';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    submitText: string = 'Đăng nhập';

    chinhanhs: ChiNhanh[] = [];
    chinhanhSelected: ChiNhanh;
    private subscription: Subscription;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private chinhanhService: ChiNhanhService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }

        this.loading = true;
        this.submitText = "Đợi một lát...";
        this.subscription = this.chinhanhService.findChiNhanhs(true).subscribe(
            data => {
                this.loading = false;
                this.chinhanhs = data;
                this.submitText = "Đăng nhập";
                if (this.authenticationService.currentChiNhanhValue) {
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        if (element.id == this.authenticationService.currentChiNhanhValue.id) {
                            this.chinhanhSelected = element;
                        }
                    }
                }
                else this.chinhanhSelected = data[0];
            },
            error => {
                this.loading = false;
                this.chinhanhService.handleError(error);
                this.submitText = "Lỗi tải dữ liệu chi nhánh!";
            }
        );
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onChangedChiNhanh(e) {
        // thay đổi giá trị chi nhánh hiện tại
        this.authenticationService.setChiNhanhValue(e.selectedItem);
    }
    
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from route parameters or default to '/'
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'trang-chu';
                    // this.router.navigate(['/' + returnUrl]); // not use navigate
                    location.href = '/' + returnUrl;
                },
                error: error => {
                    this.error = error == "Bad Request" ? "Thông tin tài khoản chưa đúng" : error;
                    this.loading = false;
                }
            });
    }

}
