import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KhoHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KhoHangService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/khohang';

    constructor(private httpClient: HttpClient) { super(); }

    findKhoHang(id: number): Observable<KhoHang> {
        return this.httpClient.get<KhoHang>(this.apiUrl + `/${id}`);
    }

    findKhoHangs(chinhanh_id: number = null,kichhoat: boolean = true): Observable<KhoHang[]> {
        // lấy danh sách kho hàng theo chi nhánh hoặc ngược lại
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        return this.httpClient.get<KhoHang[]>(this.apiUrl, { params: query_params });
    }

    addKhoHang(khohang: KhoHang): Observable<KhoHang> {
        return this.httpClient.post<KhoHang>(this.apiUrl, khohang);
    }

    updateKhoHang(khohang: KhoHang): Observable<KhoHang> {
        return this.httpClient.put<KhoHang>(this.apiUrl + `/${khohang.id}`, khohang);
    }

    deleteKhoHang(id: number): Observable<KhoHang> {
        return this.httpClient.delete<KhoHang>(this.apiUrl + `/${id}`);
    }

    checkExistKhoHang(makhohang: string, makhohang_old: string = null) {
        if (makhohang == makhohang_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?makhohang=${makhohang}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}