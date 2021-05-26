import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HangHoaDatHang, HangHoaThanhPham, PhieuDatHang } from '@app/shared/entities';

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

    findHangHoaDatHangs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<HangHoaDatHang[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<[HangHoaDatHang]>(this.apiUrl + "/hang-hoa-dat-hang" + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }
    findHangHoaDatHangThanhPhams(chinhanh_id: number = null, fromDay: Date, toDay: Date, khachhang_id: number): Observable<HangHoaThanhPham[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('khachhang_id', khachhang_id ? khachhang_id.toString() :'0');

        return this.httpClient.get<HangHoaThanhPham[]>(this.apiUrl + '/hang-hoa-dat-hang-thanh-pham', { params: query_params });
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
