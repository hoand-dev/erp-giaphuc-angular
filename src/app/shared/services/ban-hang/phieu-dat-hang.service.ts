import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuDatHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuDatHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieudathang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuDatHang(id: number): Observable<PhieuDatHang> {
        return this.httpClient.get<PhieuDatHang>(this.apiUrl + `/${id}`);
    }

    findPhieuDatHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuDatHang[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<PhieuDatHang[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuDatHang(phieudathang: PhieuDatHang): Observable<PhieuDatHang> {
        return this.httpClient.post<PhieuDatHang>(this.apiUrl, phieudathang);
    }

    updatePhieuDatHang(phieudathang: PhieuDatHang): Observable<PhieuDatHang> {
        return this.httpClient.put<PhieuDatHang>(this.apiUrl + `/${phieudathang.id}`, phieudathang);
    }

    updateTatToanPhieuDatHang(phieudathang: PhieuDatHang): Observable<PhieuDatHang> {
        return this.httpClient.put<PhieuDatHang>(this.apiUrl + `/tattoan`, phieudathang);
    }

    deletePhieuDatHang(id: number): Observable<PhieuDatHang> {
        return this.httpClient.delete<PhieuDatHang>(this.apiUrl + `/${id}`);
    }
}
