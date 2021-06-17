import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LenhSanXuat } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class LenhSanXuatService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/lenhsanxuat';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findLenhSanXuat(id: number): Observable<LenhSanXuat> {
        return this.httpClient.get<LenhSanXuat>(this.apiUrl + `/${id}`);
    }

    findLenhSanXuats(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<LenhSanXuat[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<LenhSanXuat[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addLenhSanXuat(lenhsanxuat: LenhSanXuat): Observable<LenhSanXuat> {
        return this.httpClient.post<LenhSanXuat>(this.apiUrl, lenhsanxuat);
    }

    updateLenhSanXuat(lenhsanxuat: LenhSanXuat, tattoan: boolean=false): Observable<LenhSanXuat> {
        return this.httpClient.put<LenhSanXuat>(this.apiUrl + `/${ (tattoan ? `tattoan`: lenhsanxuat.id) }`, lenhsanxuat);
    }

    deleteLenhSanXuat(id: number): Observable<LenhSanXuat> {
        return this.httpClient.delete<LenhSanXuat>(this.apiUrl + `/${id}`);
    }

    laygiaLenhSanXuat(hanghoa_id: number): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("hanghoa_id", hanghoa_id.toString());

        return this.httpClient.get<number>(this.apiUrl + `/laygia`, { params: query_params });
    }
}
