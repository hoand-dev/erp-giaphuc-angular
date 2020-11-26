import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapChuyenKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuNhapChuyenKhoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhapchuyenkho';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapChuyenKho(id: number): Observable<PhieuNhapChuyenKho> {
        return this.httpClient.get<PhieuNhapChuyenKho>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapChuyenKhos(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuNhapChuyenKho[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuNhapChuyenKho[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuNhapChuyenKho(phieunhapchuyenkho: PhieuNhapChuyenKho): Observable<PhieuNhapChuyenKho> {
        return this.httpClient.post<PhieuNhapChuyenKho>(this.apiUrl, phieunhapchuyenkho);
    }

    updatePhieuNhapChuyenKho(phieunhapchuyenkho: PhieuNhapChuyenKho): Observable<PhieuNhapChuyenKho> {
        return this.httpClient.put<PhieuNhapChuyenKho>(this.apiUrl + `/${phieunhapchuyenkho.id}`, phieunhapchuyenkho);
    }

    deletePhieuNhapChuyenKho(id: number): Observable<PhieuNhapChuyenKho> {
        return this.httpClient.delete<PhieuNhapChuyenKho>(this.apiUrl + `/${id}`);
    }
}
