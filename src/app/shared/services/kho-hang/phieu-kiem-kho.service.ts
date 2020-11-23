import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuKiemKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuKiemKhoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieukiemkho';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuKiemKho(id: number): Observable<PhieuKiemKho> {
        return this.httpClient.get<PhieuKiemKho>(this.apiUrl + `/${id}`);
    }

    findPhieuKiemKhos(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuKiemKho[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuKiemKho[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuKiemKho(phieukiemkho: PhieuKiemKho): Observable<PhieuKiemKho> {
        return this.httpClient.post<PhieuKiemKho>(this.apiUrl, phieukiemkho);
    }

    updatePhieuKiemKho(phieukiemkho: PhieuKiemKho): Observable<PhieuKiemKho> {
        return this.httpClient.put<PhieuKiemKho>(this.apiUrl + `/${phieukiemkho.id}`, phieukiemkho);
    }

    deletePhieuKiemKho(id: number): Observable<PhieuKiemKho> {
        return this.httpClient.delete<PhieuKiemKho>(this.apiUrl + `/${id}`);
    }
}
