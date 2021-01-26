import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NhaCungCap, NhaCungCap_SoTaiKhoan } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NhaCungCapService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/nhacungcap';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findNhaCungCap(id: number): Observable<NhaCungCap> {
        return this.httpClient.get<NhaCungCap>(this.apiUrl + `/${id}`);
    }

    findNhaCungCaps(): Observable<NhaCungCap[]> {
        return this.httpClient.get<NhaCungCap[]>(this.apiUrl);
    }

    findNhaCungCap_SoTaiKhoans( nhacungcap_id?:number): Observable<NhaCungCap_SoTaiKhoan[]>{
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("nhacungcap_id", nhacungcap_id ? nhacungcap_id.toString() : null);
        return this.httpClient.get<NhaCungCap_SoTaiKhoan[]>(this.apiUrl + "/so-tai-khoan", { params: query_params });
    }

    addNhaCungCap(nhacungcap: NhaCungCap): Observable<NhaCungCap> {
        return this.httpClient.post<NhaCungCap>(this.apiUrl, nhacungcap);
    }

    updateNhaCungCap(nhacungcap: NhaCungCap): Observable<NhaCungCap> {
        return this.httpClient.put<NhaCungCap>(this.apiUrl + `/${nhacungcap.id}`, nhacungcap);
    }

    deleteNhaCungCap(id: number): Observable<NhaCungCap> {
        return this.httpClient.delete<NhaCungCap>(this.apiUrl + `/${id}`);
    }
    checkExistNhaCungCap(manhacungcap: string, manhacungcap_old: string = null) {
        if (manhacungcap == manhacungcap_old) {
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true);
                }, 300);
            });
        } else {
            return this.httpClient
                .get(this.apiUrl + `/exist?manhacungcap=${manhacungcap}`)
                .toPromise()
                .then((res) => !res)
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
        }
    }
}
