import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapKhoGiaCong } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuNhapKhoGiaCongService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhapkhogiacong';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapKhoGiaCong(id: number): Observable<PhieuNhapKhoGiaCong> {
        return this.httpClient.get<PhieuNhapKhoGiaCong>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapKhoGiaCongs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuNhapKhoGiaCong[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<PhieuNhapKhoGiaCong[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuNhapKhoGiaCong(phieunhapkhogiacong: PhieuNhapKhoGiaCong): Observable<PhieuNhapKhoGiaCong> {
        return this.httpClient.post<PhieuNhapKhoGiaCong>(this.apiUrl, phieunhapkhogiacong);
    }

    updatePhieuNhapKhoGiaCong(phieunhapkhogiacong: PhieuNhapKhoGiaCong, tattoan: boolean = false): Observable<PhieuNhapKhoGiaCong> {
        return this.httpClient.put<PhieuNhapKhoGiaCong>(this.apiUrl + `/${tattoan ? `tattoan` : phieunhapkhogiacong.id}`, phieunhapkhogiacong);
    }

    deletePhieuNhapKhoGiaCong(id: number): Observable<PhieuNhapKhoGiaCong> {
        return this.httpClient.delete<PhieuNhapKhoGiaCong>(this.apiUrl + `/${id}`);
    }

    laygiaPhieuNhapKhoGiaCong(hanghoa_id: number, yeucaus: string, donvigiacong_id?: number): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('hanghoa_id', hanghoa_id.toString());
        query_params = query_params.set('yeucaus', yeucaus);
        query_params = query_params.set('donvigiacong_id', donvigiacong_id != null ? donvigiacong_id.toString() : null);

        return this.httpClient.get<number>(this.apiUrl + `/laygia`, { params: query_params });
    }
}
