import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DanhMucTieuChuan } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DanhMucTieuChuanService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/danhmuctieuchuan';

    constructor(private httpClient: HttpClient) { super(); }

    findDanhMucTieuChuan(id: number): Observable<DanhMucTieuChuan> {
        return this.httpClient.get<DanhMucTieuChuan>(this.apiUrl + `/${id}`);
    }

    findDanhMucTieuChuans(kichhoat: boolean = true): Observable<DanhMucTieuChuan[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        return this.httpClient.get<DanhMucTieuChuan[]>(this.apiUrl, { params: query_params });
    }

    addDanhMucTieuChuan(danhmuctieuchuan: DanhMucTieuChuan): Observable<DanhMucTieuChuan> {
        return this.httpClient.post<DanhMucTieuChuan>(this.apiUrl, danhmuctieuchuan);
    }

    updateDanhMucTieuChuan(danhmuctieuchuan: DanhMucTieuChuan): Observable<DanhMucTieuChuan> {
        return this.httpClient.put<DanhMucTieuChuan>(this.apiUrl + `/${danhmuctieuchuan.id}`, danhmuctieuchuan);
    }

    deleteDanhMucTieuChuan(id: number): Observable<DanhMucTieuChuan> {
        return this.httpClient.delete<DanhMucTieuChuan>(this.apiUrl + `/${id}`);
    }

    checkExistDanhMucTieuChuan(madanhmuctieuchuan: string, madanhmuctieuchuan_old: string = null) {
        if (madanhmuctieuchuan == madanhmuctieuchuan_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?madanhmuctieuchuan=${madanhmuctieuchuan}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}