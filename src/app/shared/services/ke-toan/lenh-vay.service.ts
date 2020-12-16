import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LenhVay } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class LenhVayService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/lenhvay';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findLenhVay(id: number): Observable<LenhVay> {
        return this.httpClient.get<LenhVay>(this.apiUrl + `/${id}`);
    }

    findLenhVays(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<LenhVay[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<LenhVay[]>(this.apiUrl, { params: query_params });
    }

    addLenhVay(lenhvay: LenhVay): Observable<LenhVay> {
        return this.httpClient.post<LenhVay>(this.apiUrl, lenhvay);
    }

    updateLenhVay(lenhvay: LenhVay): Observable<LenhVay> {
        return this.httpClient.put<LenhVay>(this.apiUrl + `/${lenhvay.id}`, lenhvay);
    }

    deleteLenhVay(id: number): Observable<LenhVay> {
        return this.httpClient.delete<LenhVay>(this.apiUrl + `/${id}`);
    }
}
