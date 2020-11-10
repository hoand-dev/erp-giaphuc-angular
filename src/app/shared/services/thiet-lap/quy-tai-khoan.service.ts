import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuyTaiKhoan } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuyTaiKhoanService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/quytaikhoan';

    constructor(private httpClient: HttpClient) { super(); }

    findQuyTaiKhoan(id: number): Observable<QuyTaiKhoan> {
        return this.httpClient.get<QuyTaiKhoan>(this.apiUrl + `/${id}`);
    }

    findQuyTaiKhoans(): Observable<QuyTaiKhoan[]> {
        return this.httpClient.get<QuyTaiKhoan[]>(this.apiUrl);
    }

    addQuyTaiKhoan(quytaikhoan: QuyTaiKhoan): Observable<QuyTaiKhoan> {
        return this.httpClient.post<QuyTaiKhoan>(this.apiUrl, quytaikhoan);
    }

    updateQuyTaiKhoan(quytaikhoan: QuyTaiKhoan): Observable<QuyTaiKhoan> {
        return this.httpClient.put<QuyTaiKhoan>(this.apiUrl + `/${quytaikhoan.id}`, quytaikhoan);
    }

    deleteQuyTaiKhoan(id: number): Observable<QuyTaiKhoan> {
        return this.httpClient.delete<QuyTaiKhoan>(this.apiUrl + `/${id}`);
    }

    checkExistQuyTaiKhoan(maquytaikhoan: string, maquytaikhoan_old: string = null) {
        if (maquytaikhoan == maquytaikhoan_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?maquytaikhoan=${maquytaikhoan}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}