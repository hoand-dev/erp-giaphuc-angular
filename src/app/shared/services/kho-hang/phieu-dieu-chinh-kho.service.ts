import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuDieuChinhKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuDieuChinhKhoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieudieuchinhkho';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuDieuChinhKho(id: number): Observable<PhieuDieuChinhKho> {
        return this.httpClient.get<PhieuDieuChinhKho>(this.apiUrl + `/${id}`);
    }

    findPhieuDieuChinhKhos(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuDieuChinhKho[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuDieuChinhKho[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuDieuChinhKho(phieudieuchinhkho: PhieuDieuChinhKho): Observable<PhieuDieuChinhKho> {
        return this.httpClient.post<PhieuDieuChinhKho>(this.apiUrl, phieudieuchinhkho);
    }

    updatePhieuDieuChinhKho(phieudieuchinhkho: PhieuDieuChinhKho): Observable<PhieuDieuChinhKho> {
        return this.httpClient.put<PhieuDieuChinhKho>(this.apiUrl + `/${phieudieuchinhkho.id}`, phieudieuchinhkho);
    }

    deletePhieuDieuChinhKho(id: number): Observable<PhieuDieuChinhKho> {
        return this.httpClient.delete<PhieuDieuChinhKho>(this.apiUrl + `/${id}`);
    }
}
