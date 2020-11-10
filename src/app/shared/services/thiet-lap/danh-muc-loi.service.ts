import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DanhMucLoi } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DanhMucLoiService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/danhmucloi';

    constructor(private httpClient: HttpClient) { super(); }

    findDanhMucLoi(id: number): Observable<DanhMucLoi> {
        return this.httpClient.get<DanhMucLoi>(this.apiUrl + `/${id}`);
    }

    findDanhMucLois(): Observable<DanhMucLoi[]> {
        return this.httpClient.get<DanhMucLoi[]>(this.apiUrl);
    }

    addDanhMucLoi(danhmucloi: DanhMucLoi): Observable<DanhMucLoi> {
        return this.httpClient.post<DanhMucLoi>(this.apiUrl, danhmucloi);
    }

    updateDanhMucLoi(danhmucloi: DanhMucLoi): Observable<DanhMucLoi> {
        return this.httpClient.put<DanhMucLoi>(this.apiUrl + `/${danhmucloi.id}`, danhmucloi);
    }

    deleteDanhMucLoi(id: number): Observable<DanhMucLoi> {
        return this.httpClient.delete<DanhMucLoi>(this.apiUrl + `/${id}`);
    }

    checkExistDanhMucLoi(madanhmucloi: string, madanhmucloi_old: string = null) {
        if (madanhmucloi == madanhmucloi_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?madanhmucloi=${madanhmucloi}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}
