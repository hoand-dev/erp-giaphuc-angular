import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NguonNhanLuc } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NguonNhanLucService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/nguonnhanluc';

    constructor(private httpClient: HttpClient) { super(); }

    findNguonNhanLuc(id: number): Observable<NguonNhanLuc> {
        return this.httpClient.get<NguonNhanLuc>(this.apiUrl + `/${id}`);
    }

    findNguonNhanLucs(kichhoat: boolean = true): Observable<NguonNhanLuc[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        return this.httpClient.get<NguonNhanLuc[]>(this.apiUrl, { params: query_params });
    }

    addNguonNhanLuc(nguonnhanluc: NguonNhanLuc): Observable<NguonNhanLuc> {
        return this.httpClient.post<NguonNhanLuc>(this.apiUrl, nguonnhanluc);
    }

    updateNguonNhanLuc(nguonnhanluc: NguonNhanLuc): Observable<NguonNhanLuc> {
        return this.httpClient.put<NguonNhanLuc>(this.apiUrl + `/${nguonnhanluc.id}`, nguonnhanluc);
    }

    deleteNguonNhanLuc(id: number): Observable<NguonNhanLuc> {
        return this.httpClient.delete<NguonNhanLuc>(this.apiUrl + `/${id}`);
    }

    checkExistNguonNhanLuc(manguonnhanluc: string, manguonnhanluc_old: string = null) {
        if (manguonnhanluc == manguonnhanluc_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?manguonnhanluc=${manguonnhanluc}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}