import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KhuVuc } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KhuVucService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/khuvuc';

    constructor(private httpClient: HttpClient) { super(); }

    findKhuVuc(id: number): Observable<KhuVuc> {
        return this.httpClient.get<KhuVuc>(this.apiUrl + `/${id}`);
    }

    findKhuVucs(): Observable<KhuVuc[]> {
        return this.httpClient.get<KhuVuc[]>(this.apiUrl);
    }

    addKhuVuc(khuvuc: KhuVuc): Observable<KhuVuc> {
        return this.httpClient.post<KhuVuc>(this.apiUrl, khuvuc);
    }

    updateKhuVuc(khuvuc: KhuVuc): Observable<KhuVuc> {
        return this.httpClient.put<KhuVuc>(this.apiUrl + `/${khuvuc.id}`, khuvuc);
    }

    deleteKhuVuc(id: number): Observable<KhuVuc> {
        return this.httpClient.delete<KhuVuc>(this.apiUrl + `/${id}`);
    }

    checkKhuVucExist(makhuvuc: string, makhuvuc_old: string = null) {
        if (makhuvuc == makhuvuc_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?makhuvuc=${makhuvuc}`)
                .toPromise()
                .then(
                    res => !res
                    ) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                    return false; // tuong duong da ton tai
                });
      }

}