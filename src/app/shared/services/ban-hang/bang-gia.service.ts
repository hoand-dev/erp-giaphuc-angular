import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BangGia } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class BangGiaService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/banggia';

    constructor(private httpClient: HttpClient) { super(); }
		
		findBangGia(id: number): Observable<BangGia> {
        return this.httpClient.get<BangGia>(this.apiUrl + `/${id}`);
    }
		
		findBangGias(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<BangGia[]> {
            let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
            let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
            let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
            return this.httpClient.get<BangGia[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
        }

    addBangGia(banggia: BangGia): Observable<BangGia> {
        return this.httpClient.post<BangGia>(this.apiUrl, banggia);
    }

    updateBangGia(banggia: BangGia): Observable<BangGia> {
        return this.httpClient.put<BangGia>(this.apiUrl + `/${banggia.id}`, banggia);
    }

    deleteBangGia(id: number): Observable<BangGia> {
        return this.httpClient.delete<BangGia>(this.apiUrl + `/${id}`);
    }
}
