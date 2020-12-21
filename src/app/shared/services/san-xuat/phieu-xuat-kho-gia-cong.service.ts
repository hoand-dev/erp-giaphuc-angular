import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuXuatKhoGiaCong } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuXuatKhoGiaCongService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuxuatkhogiacong';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuXuatKhoGiaCong(id: number): Observable<PhieuXuatKhoGiaCong> {
        return this.httpClient.get<PhieuXuatKhoGiaCong>(this.apiUrl + `/${id}`);
    }

    findPhieuXuatKhoGiaCongs(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuXuatKhoGiaCong[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuXuatKhoGiaCong[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuXuatKhoGiaCong(phieuxuatkhogiacong: PhieuXuatKhoGiaCong): Observable<PhieuXuatKhoGiaCong> {
        return this.httpClient.post<PhieuXuatKhoGiaCong>(this.apiUrl, phieuxuatkhogiacong);
    }

    updatePhieuXuatKhoGiaCong(phieuxuatkhogiacong: PhieuXuatKhoGiaCong): Observable<PhieuXuatKhoGiaCong> {
        return this.httpClient.put<PhieuXuatKhoGiaCong>(this.apiUrl + `/${phieuxuatkhogiacong.id}`, phieuxuatkhogiacong);
    }

    deletePhieuXuatKhoGiaCong(id: number): Observable<PhieuXuatKhoGiaCong> {
        return this.httpClient.delete<PhieuXuatKhoGiaCong>(this.apiUrl + `/${id}`);
    }
}
