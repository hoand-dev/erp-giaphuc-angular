import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuXuatTraMuonHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuXuatTraMuonHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuxuattramuonhang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuXuatTraMuonHang(id: number): Observable<PhieuXuatTraMuonHang> {
        return this.httpClient.get<PhieuXuatTraMuonHang>(this.apiUrl + `/${id}`);
    }

    findPhieuXuatTraMuonHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuXuatTraMuonHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<PhieuXuatTraMuonHang[]>(this.apiUrl, { params: query_params });
    }

    addPhieuXuatTraMuonHang(phieuxuattramuonhang: PhieuXuatTraMuonHang): Observable<PhieuXuatTraMuonHang> {
        return this.httpClient.post<PhieuXuatTraMuonHang>(this.apiUrl, phieuxuattramuonhang);
    }

    updatePhieuXuatTraMuonHang(phieuxuattramuonhang: PhieuXuatTraMuonHang): Observable<PhieuXuatTraMuonHang> {
        return this.httpClient.put<PhieuXuatTraMuonHang>(this.apiUrl + `/${phieuxuattramuonhang.id}`, phieuxuattramuonhang);
    }

    deletePhieuXuatTraMuonHang(id: number): Observable<PhieuXuatTraMuonHang> {
        return this.httpClient.delete<PhieuXuatTraMuonHang>(this.apiUrl + `/${id}`);
    }
}
