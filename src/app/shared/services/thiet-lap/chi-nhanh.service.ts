import { BaseService } from '@app/shared/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChiNhanh } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ChiNhanhService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/chinhanh';

    constructor(private httpClient: HttpClient) { super(); }

    findChiNhanh(id: number): Observable<ChiNhanh> {
        return this.httpClient.get<ChiNhanh>(this.apiUrl + `/${id}`);
    }

    findChiNhanhs(notAuth: boolean = false): Observable<ChiNhanh[]> {
        if (notAuth) {
            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
            return this.httpClient.get<any>(this.apiUrl + '/not-auth', { headers: reqHeader });
        }
        return this.httpClient.get<ChiNhanh[]>(this.apiUrl);
    }

    addChiNhanh(chinhanh: ChiNhanh): Observable<ChiNhanh> {
        return this.httpClient.post<ChiNhanh>(this.apiUrl, chinhanh);
    }

    updateChiNhanh(chinhanh: ChiNhanh): Observable<ChiNhanh> {
        return this.httpClient.put<ChiNhanh>(this.apiUrl + `/${chinhanh.id}`, chinhanh);
    }

    deleteChiNhanh(id: number): Observable<ChiNhanh> {
        return this.httpClient.delete<ChiNhanh>(this.apiUrl + `/${id}`);
    }

    checkExistChiNhanh(machinhanh: string, machinhanh_old: string = null) {
        if (machinhanh == machinhanh_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?machinhanh=${machinhanh}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}
