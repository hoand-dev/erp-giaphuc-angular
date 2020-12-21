import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuCanTru, PhieuCanTru_PhieuNhapKho, PhieuCanTru_PhieuXuatKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuCanTruService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieucantru';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuCanTru(id: number): Observable<PhieuCanTru> {
        return this.httpClient.get<PhieuCanTru>(this.apiUrl + `/${id}`);
    }

    findPhieuCanTrus(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuCanTru[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));

        return this.httpClient.get<PhieuCanTru[]>(this.apiUrl, { params: query_params });
    }

    findPhieuXuatKhos(chinhanh_id: number, khachhang_id?: number, nhacungcap_id?: number): Observable<PhieuCanTru_PhieuXuatKho[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('khachhang_id', khachhang_id ? khachhang_id.toString() : null);
        query_params = query_params.set('nhacungcap_id', nhacungcap_id ? nhacungcap_id.toString() : null);

        return this.httpClient.get<PhieuCanTru_PhieuXuatKho[]>(this.apiUrl + '/phieu-xuat-kho', { params: query_params });
    }

    findPhieuNhapKhos(chinhanh_id: number, khachhang_id?: number, nhacungcap_id?: number): Observable<PhieuCanTru_PhieuNhapKho[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('khachhang_id', khachhang_id ? khachhang_id.toString() : null);
        query_params = query_params.set('nhacungcap_id', nhacungcap_id ? nhacungcap_id.toString() : null);

        return this.httpClient.get<PhieuCanTru_PhieuNhapKho[]>(this.apiUrl + '/phieu-nhap-kho', { params: query_params });
    }

    addPhieuCanTru(phieucantru: PhieuCanTru): Observable<PhieuCanTru> {
        return this.httpClient.post<PhieuCanTru>(this.apiUrl, phieucantru);
    }

    updatePhieuCanTru(phieucantru: PhieuCanTru): Observable<PhieuCanTru> {
        return this.httpClient.put<PhieuCanTru>(this.apiUrl + `/${phieucantru.id}`, phieucantru);
    }

    deletePhieuCanTru(id: number): Observable<PhieuCanTru> {
        return this.httpClient.delete<PhieuCanTru>(this.apiUrl + `/${id}`);
    }
}
