import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapMuonHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuNhapMuonHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhapmuonhang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapMuonHang(id: number): Observable<PhieuNhapMuonHang> {
        return this.httpClient.get<PhieuNhapMuonHang>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapMuonHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuNhapMuonHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<PhieuNhapMuonHang[]>(this.apiUrl, { params: query_params });
    }

    addPhieuNhapMuonHang(phieunhapmuonhang: PhieuNhapMuonHang): Observable<PhieuNhapMuonHang> {
        return this.httpClient.post<PhieuNhapMuonHang>(this.apiUrl, phieunhapmuonhang);
    }

    updatePhieuNhapMuonHang(phieunhapmuonhang: PhieuNhapMuonHang): Observable<PhieuNhapMuonHang> {
        return this.httpClient.put<PhieuNhapMuonHang>(this.apiUrl + `/${phieunhapmuonhang.id}`, phieunhapmuonhang);
    }

    deletePhieuNhapMuonHang(id: number): Observable<PhieuNhapMuonHang> {
        return this.httpClient.delete<PhieuNhapMuonHang>(this.apiUrl + `/${id}`);
    }
}
