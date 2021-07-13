import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuBanHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuBanHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieubanhang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuBanHang(id: number): Observable<PhieuBanHang> {
        return this.httpClient.get<PhieuBanHang>(this.apiUrl + `/${id}`);
    }

    findPhieuBanHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<PhieuBanHang[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<PhieuBanHang[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuBanHang(phieubanhang: PhieuBanHang): Observable<PhieuBanHang> {
        return this.httpClient.post<PhieuBanHang>(this.apiUrl, phieubanhang);
    }

    updatePhieuBanHang(phieubanhang: PhieuBanHang): Observable<PhieuBanHang> {
        return this.httpClient.put<PhieuBanHang>(this.apiUrl + `/${phieubanhang.id}`, phieubanhang);
    }

    updateTatToanPhieuBanHang(phieubanhang: PhieuBanHang): Observable<PhieuBanHang> {
        return this.httpClient.put<PhieuBanHang>(this.apiUrl + `/tattoan`, phieubanhang);
    }

    updateDuyetGiaPhieuBanHang(phieubanhang: PhieuBanHang): Observable<boolean> {
        return this.httpClient.put<boolean>(this.apiUrl + `/duyetgia`, phieubanhang);
    }

    deletePhieuBanHang(id: number): Observable<PhieuBanHang> {
        return this.httpClient.delete<PhieuBanHang>(this.apiUrl + `/${id}`);
    }

    laygiaTheoBangGia(hanghoa_id: number, layvat:boolean, phantramvat, khachhang_id?: number): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("hanghoa_id", hanghoa_id.toString());
        query_params = query_params.set("layvat", layvat.toString());
        query_params = query_params.set("phantramvat", phantramvat.toString());
        query_params = query_params.set("khachhang_id", khachhang_id != null? khachhang_id.toString() : null);
        return this.httpClient.get<number>(this.apiUrl + `/laygia`, { params: query_params });
    }
}
