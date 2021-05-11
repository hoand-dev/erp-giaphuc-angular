import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NoiDungThuChi } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NoiDungThuChiService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/noidungthuchi';

    constructor(private httpClient: HttpClient) { super(); }

    findNoiDungThuChi(id: number): Observable<NoiDungThuChi> {
        return this.httpClient.get<NoiDungThuChi>(this.apiUrl + `/${id}`);
    }

    findNoiDungThuChis(loaithuchi: string = null,kichhoat: boolean = true): Observable<NoiDungThuChi[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        query_params = query_params.set('loaithuchi', loaithuchi);
        return this.httpClient.get<NoiDungThuChi[]>(this.apiUrl, { params: query_params });
    }

    addNoiDungThuChi(noidungthuchi: NoiDungThuChi): Observable<NoiDungThuChi> {
        return this.httpClient.post<NoiDungThuChi>(this.apiUrl, noidungthuchi);
    }

    updateNoiDungThuChi(noidungthuchi: NoiDungThuChi): Observable<NoiDungThuChi> {
        return this.httpClient.put<NoiDungThuChi>(this.apiUrl + `/${noidungthuchi.id}`, noidungthuchi);
    }

    deleteNoiDungThuChi(id: number): Observable<NoiDungThuChi> {
        return this.httpClient.delete<NoiDungThuChi>(this.apiUrl + `/${id}`);
    }

    checkExistNoiDungThuChi(manoidungthuchi: string, manoidungthuchi_old: string = null) {
        if (manoidungthuchi == manoidungthuchi_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?manoidungthuchi=${manoidungthuchi}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}