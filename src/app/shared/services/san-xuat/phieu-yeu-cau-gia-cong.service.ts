import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuYeuCauGiaCong } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuYeuCauGiaCongService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuyeucaugiacong';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuYeuCauGiaCong(id: number): Observable<PhieuYeuCauGiaCong> {
        return this.httpClient.get<PhieuYeuCauGiaCong>(this.apiUrl + `/${id}`);
    }

    findPhieuYeuCauGiaCongs(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuYeuCauGiaCong[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuYeuCauGiaCong[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuYeuCauGiaCong(phieuyeucaugiacong: PhieuYeuCauGiaCong): Observable<PhieuYeuCauGiaCong> {
        return this.httpClient.post<PhieuYeuCauGiaCong>(this.apiUrl, phieuyeucaugiacong);
    }

    updatePhieuYeuCauGiaCong(phieuyeucaugiacong: PhieuYeuCauGiaCong, tattoan: boolean=false): Observable<PhieuYeuCauGiaCong> {
        return this.httpClient.put<PhieuYeuCauGiaCong>(this.apiUrl + `/${ (tattoan ? `tattoan`: phieuyeucaugiacong.id) }`, phieuyeucaugiacong);
    }

    deletePhieuYeuCauGiaCong(id: number): Observable<PhieuYeuCauGiaCong> {
        return this.httpClient.delete<PhieuYeuCauGiaCong>(this.apiUrl + `/${id}`);
    }

    laygiaPhieuYeuCauGiaCong(hanghoa_id: number, yeucaus: string, donvigiacong_id?: number): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("hanghoa_id", hanghoa_id.toString());
        query_params = query_params.set("yeucaus", yeucaus);
        query_params = query_params.set("donvigiacong_id", donvigiacong_id != null? donvigiacong_id.toString() : null);

        return this.httpClient.get<number>(this.apiUrl + `/laygia`, { params: query_params });
    }
}
