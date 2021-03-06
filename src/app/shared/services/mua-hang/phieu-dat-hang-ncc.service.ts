import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuDatHangNCC } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuDatHangNCCService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieudathangncc';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuDatHangNCC(id: number): Observable<PhieuDatHangNCC> {
        return this.httpClient.get<PhieuDatHangNCC>(this.apiUrl + `/${id}`);
    }

    findPhieuDatHangNCCs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuDatHangNCC[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<PhieuDatHangNCC[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuDatHangNCC(phieudathangncc: PhieuDatHangNCC): Observable<PhieuDatHangNCC> {
        return this.httpClient.post<PhieuDatHangNCC>(this.apiUrl, phieudathangncc);
    }

    updatePhieuDatHangNCC(phieudathangncc: PhieuDatHangNCC): Observable<PhieuDatHangNCC> {
        return this.httpClient.put<PhieuDatHangNCC>(this.apiUrl + `/${phieudathangncc.id}`, phieudathangncc);
    }

    updateTatToanPhieuDatHangNCC(phieudathangncc: PhieuDatHangNCC): Observable<PhieuDatHangNCC> {
        return this.httpClient.put<PhieuDatHangNCC>(this.apiUrl + `/tattoan`, phieudathangncc);
    }

    deletePhieuDatHangNCC(id: number): Observable<PhieuDatHangNCC> {
        return this.httpClient.delete<PhieuDatHangNCC>(this.apiUrl + `/${id}`);
    }
}
