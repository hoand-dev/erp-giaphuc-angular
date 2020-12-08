import { Observable } from 'rxjs';
import moment from 'moment';

import { environment } from '@environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuChi } from '../../entities/ke-toan/phieu-chi';
import { BaseService } from '../base-service';


@Injectable({
  providedIn: 'root'
})
export class PhieuChiService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/PhieuChi';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuChi(id: number): Observable<PhieuChi> {
        return this.httpClient.get<PhieuChi>(this.apiUrl + `/${id}`);
    }

    findPhieuChis(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuChi[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuChi[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuChi(PhieuChi: PhieuChi): Observable<PhieuChi> {
        return this.httpClient.post<PhieuChi>(this.apiUrl, PhieuChi);
    }

    updatePhieuChi(PhieuChi: PhieuChi): Observable<PhieuChi> {
        return this.httpClient.put<PhieuChi>(this.apiUrl + `/${PhieuChi.id}`, PhieuChi);
    }

    deletePhieuChi(id: number): Observable<PhieuChi> {
        return this.httpClient.delete<PhieuChi>(this.apiUrl + `/${id}`);
    }
}
