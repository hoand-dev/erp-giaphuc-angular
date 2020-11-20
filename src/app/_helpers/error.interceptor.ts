import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '@app/_services';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                // auto logout if 401 response returned from api
                if (err.status === 401 || (err.status === 400 && request.url.indexOf('auth-token') != -1)) {
                    
                    Swal.fire({
                        title: 'Hết phiên làm việc!',
                        html: 'Đăng nhập lại nhé',
                        icon: 'warning',
                        timer: 3000,
                        timerProgressBar: true
                    }).then(()=>{
                        this.authenticationService.logout(true);
                    });

                    return throwError('Hết phiên làm việc');
                }
                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}