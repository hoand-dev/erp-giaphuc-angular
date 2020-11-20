import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuTraHangNCC } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuTraHangNCCService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieutrahangncc';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuTraHangNCC(id: number): Observable<PhieuTraHangNCC> {
        return this.httpClient.get<PhieuTraHangNCC>(this.apiUrl + `/${id}`);
    }

    findPhieuTraHangNCCs(chinhanh_id: number, fromDay:Date, toDay: Date): Observable<PhieuTraHangNCC[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuTraHangNCC[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuTraHangNCC(phieutrahangncc: PhieuTraHangNCC): Observable<PhieuTraHangNCC> {
        return this.httpClient.post<PhieuTraHangNCC>(this.apiUrl, phieutrahangncc);
    }

    updatePhieuTraHangNCC(phieutrahangncc: PhieuTraHangNCC): Observable<PhieuTraHangNCC> {
        return this.httpClient.put<PhieuTraHangNCC>(this.apiUrl + `/${phieutrahangncc.id}`, phieutrahangncc);
    }

    deletePhieuTraHangNCC(id: number): Observable<PhieuTraHangNCC> {
        return this.httpClient.delete<PhieuTraHangNCC>(this.apiUrl + `/${id}`);
    }
}