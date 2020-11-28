import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuKhachTraHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuKhachTraHangService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/phieukhachtrahang';

    constructor(private httpClient: HttpClient) { super(); }
		
		findPhieuKhachTraHang(id: number): Observable<PhieuKhachTraHang> {
        return this.httpClient.get<PhieuKhachTraHang>(this.apiUrl + `/${id}`);
    }
		
		findPhieuKhachTraHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuKhachTraHang[]> {
            let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
            let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
            let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
            return this.httpClient.get<PhieuKhachTraHang[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuKhachTraHang(phieukhachtrahang: PhieuKhachTraHang): Observable<PhieuKhachTraHang> {
        return this.httpClient.post<PhieuKhachTraHang>(this.apiUrl, phieukhachtrahang);
    }

    updatePhieuKhachTraHang(phieukhachtrahang: PhieuKhachTraHang): Observable<PhieuKhachTraHang> {
        return this.httpClient.put<PhieuKhachTraHang>(this.apiUrl + `/${phieukhachtrahang.id}`, phieukhachtrahang);
    }

    deletePhieuKhachTraHang(id: number): Observable<PhieuKhachTraHang> {
        return this.httpClient.delete<PhieuKhachTraHang>(this.apiUrl + `/${id}`);
    }
}
