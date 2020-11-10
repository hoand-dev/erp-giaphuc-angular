import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DanhMucNo } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DanhMucNoService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/danhmucno';

    constructor(private httpClient: HttpClient) { super(); }

    findDanhMucNo(id: number): Observable<DanhMucNo> {
        return this.httpClient.get<DanhMucNo>(this.apiUrl + `/${id}`);
    }

    findDanhMucNos(): Observable<DanhMucNo[]> {
        return this.httpClient.get<DanhMucNo[]>(this.apiUrl);
    }

    addDanhMucNo(danhmucno: DanhMucNo): Observable<DanhMucNo> {
        return this.httpClient.post<DanhMucNo>(this.apiUrl, danhmucno);
    }

    updateDanhMucNo(danhmucno: DanhMucNo): Observable<DanhMucNo> {
        return this.httpClient.put<DanhMucNo>(this.apiUrl + `/${danhmucno.id}`, danhmucno);
    }

    deleteDanhMucNo(id: number): Observable<DanhMucNo> {
        return this.httpClient.delete<DanhMucNo>(this.apiUrl + `/${id}`);
    }

    checkExistDanhMucNo(madanhmucno: string, madanhmucno_old: string = null) {
        if (madanhmucno == madanhmucno_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?madanhmucno=${madanhmucno}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}