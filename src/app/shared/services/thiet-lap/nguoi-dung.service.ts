import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NguoiDung, NguoiDung_NhomKhachHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { User } from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class NguoiDungService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/nguoidung';

    constructor(private httpClient: HttpClient) {
        super();
    }

    getCurrentUser(): Observable<User> {
        return this.httpClient.get<User>(environment.apiUrl + '/auth-current');
    }

    getAllPermission(): Observable<any> {
        return this.httpClient.get<any>(this.apiUrl + '/tim-kiem-quyen');
    }

    findNguoiDung(id: number): Observable<NguoiDung> {
        return this.httpClient.get<NguoiDung>(this.apiUrl + `/${id}`);
    }

    findNguoiDungs(): Observable<NguoiDung[]> {
        return this.httpClient.get<NguoiDung[]>(this.apiUrl);
    }

    
    addNguoiDung(nguoidung: NguoiDung): Observable<NguoiDung> {
        return this.httpClient.post<NguoiDung>(this.apiUrl, nguoidung);
    }

    updateNguoiDung(nguoidung: NguoiDung): Observable<NguoiDung> {
        return this.httpClient.put<NguoiDung>(this.apiUrl + `/${nguoidung.id}`, nguoidung);
    }

    resetPassword(id: number): Observable<boolean> {
        return this.httpClient.put<boolean>(this.apiUrl + `/reset-password`, id);
    }

    changePassword(crrPass: string, newPass: string): Observable<boolean> {
        return this.httpClient.put<boolean>(this.apiUrl + `/change-password`, {crrPass: crrPass, newPass: newPass});
    }

    deleteNguoiDung(id: number): Observable<NguoiDung> {
        return this.httpClient.delete<NguoiDung>(this.apiUrl + `/${id}`);
    }

    checkNguoiDungExist(username: string, username_old: string = null) {
        if (username == username_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient
                .get(this.apiUrl + `/exist?username=${username}`)
                .toPromise()
                .then((res) => 
                    !res
                ) // false -> true (chưa tồn tại) và ngược lại
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}
