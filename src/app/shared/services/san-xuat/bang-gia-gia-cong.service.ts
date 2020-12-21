import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BangGiaGiaCong } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class BangGiaGiaCongService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/banggiagiacong';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findBangGiaGiaCong(id: number): Observable<BangGiaGiaCong> {
        return this.httpClient.get<BangGiaGiaCong>(this.apiUrl + `/${id}`);
    }

    // áp dụng cho tất cả chi nhánh
    findBangGiaGiaCongs(/* chinhanh_id: number = null,  */fromDay: Date, toDay: Date): Observable<BangGiaGiaCong[]> {
        let query_params: HttpParams = new HttpParams();
        /* query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null); */
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<BangGiaGiaCong[]>(this.apiUrl, { params: query_params });
    }

    addBangGiaGiaCong(banggiagiacong: BangGiaGiaCong): Observable<BangGiaGiaCong> {
        return this.httpClient.post<BangGiaGiaCong>(this.apiUrl, banggiagiacong);
    }

    updateBangGiaGiaCong(banggiagiacong: BangGiaGiaCong): Observable<BangGiaGiaCong> {
        return this.httpClient.put<BangGiaGiaCong>(this.apiUrl + `/${banggiagiacong.id}`, banggiagiacong);
    }

    deleteBangGiaGiaCong(id: number): Observable<BangGiaGiaCong> {
        return this.httpClient.delete<BangGiaGiaCong>(this.apiUrl + `/${id}`);
    }
}
