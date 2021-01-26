import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuXuatMuonHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuXuatMuonHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuxuatmuonhang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuXuatMuonHang(id: number): Observable<PhieuXuatMuonHang> {
        return this.httpClient.get<PhieuXuatMuonHang>(this.apiUrl + `/${id}`);
    }

    findPhieuXuatMuonHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuXuatMuonHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<PhieuXuatMuonHang[]>(this.apiUrl, { params: query_params });
    }

    addPhieuXuatMuonHang(phieuxuatmuonhang: PhieuXuatMuonHang): Observable<PhieuXuatMuonHang> {
        return this.httpClient.post<PhieuXuatMuonHang>(this.apiUrl, phieuxuatmuonhang);
    }

    updatePhieuXuatMuonHang(phieuxuatmuonhang: PhieuXuatMuonHang): Observable<PhieuXuatMuonHang> {
        return this.httpClient.put<PhieuXuatMuonHang>(this.apiUrl + `/${phieuxuatmuonhang.id}`, phieuxuatmuonhang);
    }

    deletePhieuXuatMuonHang(id: number): Observable<PhieuXuatMuonHang> {
        return this.httpClient.delete<PhieuXuatMuonHang>(this.apiUrl + `/${id}`);
    }
}
