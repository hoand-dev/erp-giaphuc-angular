import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuMuaHangNCC } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuMuaHangNCCService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieumuahangncc';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuMuaHangNCC(id: number): Observable<PhieuMuaHangNCC> {
        return this.httpClient.get<PhieuMuaHangNCC>(this.apiUrl + `/${id}`);
    }

    findPhieuMuaHangNCCs(chinhanh_id: number, fromDay: Date, toDay: Date): Observable<PhieuMuaHangNCC[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<PhieuMuaHangNCC[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuMuaHangNCC(phieumuahangncc: PhieuMuaHangNCC): Observable<PhieuMuaHangNCC> {
        return this.httpClient.post<PhieuMuaHangNCC>(this.apiUrl, phieumuahangncc);
    }

    updatePhieuMuaHangNCC(phieumuahangncc: PhieuMuaHangNCC): Observable<PhieuMuaHangNCC> {
        return this.httpClient.put<PhieuMuaHangNCC>(this.apiUrl + `/${phieumuahangncc.id}`, phieumuahangncc);
    }

    updateTatToanPhieuMuaHangNCC(phieumuahangncc: PhieuMuaHangNCC): Observable<PhieuMuaHangNCC> {
        return this.httpClient.put<PhieuMuaHangNCC>(this.apiUrl + `/tattoan`, phieumuahangncc);
    }

    deletePhieuMuaHangNCC(id: number): Observable<PhieuMuaHangNCC> {
        return this.httpClient.delete<PhieuMuaHangNCC>(this.apiUrl + `/${id}`);
    }
}
