import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AuthenticationService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err) => {
                // auto logout if 401 response returned from api
                if (err.status === 401 || (err.status === 400 && request.url.indexOf('auth-token') != -1)) {
                    this.authenticationService.logout();
                    location.reload();
                    alert('Hết phiên làm việc. Đăng nhập lại nhé ^_^');
                    return throwError('Hết phiên làm việc');
                }
                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}