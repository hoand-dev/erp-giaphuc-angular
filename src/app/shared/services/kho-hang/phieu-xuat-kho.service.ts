import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuXuatKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuXuatKhoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuxuatkho';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuXuatKho(id: number): Observable<PhieuXuatKho> {
        return this.httpClient.get<PhieuXuatKho>(this.apiUrl + `/${id}`);
    }

    findPhieuXuatKhos(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuXuatKho[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuXuatKho[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuXuatKho(phieuxuatkho: PhieuXuatKho): Observable<PhieuXuatKho> {
        return this.httpClient.post<PhieuXuatKho>(this.apiUrl, phieuxuatkho);
    }

    updatePhieuXuatKho(phieuxuatkho: PhieuXuatKho): Observable<PhieuXuatKho> {
        return this.httpClient.put<PhieuXuatKho>(this.apiUrl + `/${phieuxuatkho.id}`, phieuxuatkho);
    }

    deletePhieuXuatKho(id: number): Observable<PhieuXuatKho> {
        return this.httpClient.delete<PhieuXuatKho>(this.apiUrl + `/${id}`);
    }
}
