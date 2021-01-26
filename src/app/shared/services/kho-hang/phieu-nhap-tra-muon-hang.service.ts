import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapTraMuonHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuNhapTraMuonHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhaptramuonhang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapTraMuonHang(id: number): Observable<PhieuNhapTraMuonHang> {
        return this.httpClient.get<PhieuNhapTraMuonHang>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapTraMuonHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuNhapTraMuonHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<PhieuNhapTraMuonHang[]>(this.apiUrl, { params: query_params });
    }

    addPhieuNhapTraMuonHang(phieunhaptramuonhang: PhieuNhapTraMuonHang): Observable<PhieuNhapTraMuonHang> {
        return this.httpClient.post<PhieuNhapTraMuonHang>(this.apiUrl, phieunhaptramuonhang);
    }

    updatePhieuNhapTraMuonHang(phieunhaptramuonhang: PhieuNhapTraMuonHang): Observable<PhieuNhapTraMuonHang> {
        return this.httpClient.put<PhieuNhapTraMuonHang>(this.apiUrl + `/${phieunhaptramuonhang.id}`, phieunhaptramuonhang);
    }

    deletePhieuNhapTraMuonHang(id: number): Observable<PhieuNhapTraMuonHang> {
        return this.httpClient.delete<PhieuNhapTraMuonHang>(this.apiUrl + `/${id}`);
    }
}
