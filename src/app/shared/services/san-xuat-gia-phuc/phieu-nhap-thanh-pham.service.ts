import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapThanhPham } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuNhapThanhPhamService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhapthanhpham';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapThanhPham(id: number): Observable<PhieuNhapThanhPham> {
        return this.httpClient.get<PhieuNhapThanhPham>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapThanhPhams(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuNhapThanhPham[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuNhapThanhPham[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuNhapThanhPham(phieunhapthanhpham: PhieuNhapThanhPham): Observable<PhieuNhapThanhPham> {
        return this.httpClient.post<PhieuNhapThanhPham>(this.apiUrl, phieunhapthanhpham);
    }

    updatePhieuNhapThanhPham(phieunhapthanhpham: PhieuNhapThanhPham): Observable<PhieuNhapThanhPham> {
        return this.httpClient.put<PhieuNhapThanhPham>(this.apiUrl + `/${ phieunhapthanhpham.id }`, phieunhapthanhpham);
    }

    deletePhieuNhapThanhPham(id: number): Observable<PhieuNhapThanhPham> {
        return this.httpClient.delete<PhieuNhapThanhPham>(this.apiUrl + `/${id}`);
    }
}
