import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuNhapKhoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhapkho';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapKho(id: number): Observable<PhieuNhapKho> {
        return this.httpClient.get<PhieuNhapKho>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapKhos(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuNhapKho[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuNhapKho[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuNhapKho(phieunhapkho: PhieuNhapKho): Observable<PhieuNhapKho> {
        return this.httpClient.post<PhieuNhapKho>(this.apiUrl, phieunhapkho);
    }

    updatePhieuNhapKho(phieunhapkho: PhieuNhapKho): Observable<PhieuNhapKho> {
        return this.httpClient.put<PhieuNhapKho>(this.apiUrl + `/${phieunhapkho.id}`, phieunhapkho);
    }

    deletePhieuNhapKho(id: number): Observable<PhieuNhapKho> {
        return this.httpClient.delete<PhieuNhapKho>(this.apiUrl + `/${id}`);
    }
}
