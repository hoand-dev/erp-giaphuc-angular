import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                // auto logout if 401 response returned from api
                if ((err.status === 401 && err.url.indexOf("user-online") == -1) || (err.status === 400 && request.body.indexOf('refresh_token') != -1)) {
                    Swal.fire({
                        title: 'HẾT PHIÊN LÀM VIỆC!',
                        html: 'Đăng nhập lại nhé',
                        icon: 'warning',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
                        this.authenticationService.logout();
                        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url.replace('/', '') } });
                    });

                    return throwError('Hết phiên làm việc');
                }

                if (err.status === 400 && request.url.indexOf('auth-token') != -1) {
                    const error = err.error.error_description || 'Thông tin tài khoản chưa đúng';
                    return throwError(error);
                }

                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}
