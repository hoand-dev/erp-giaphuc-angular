import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuXuatChuyenKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuXuatChuyenKhoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuxuatchuyenkho';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuXuatChuyenKho(id: number): Observable<PhieuXuatChuyenKho> {
        return this.httpClient.get<PhieuXuatChuyenKho>(this.apiUrl + `/${id}`);
    }

    findPhieuXuatChuyenKhos(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuXuatChuyenKho[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuXuatChuyenKho[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuXuatChuyenKho(phieuxuatchuyenkho: PhieuXuatChuyenKho): Observable<PhieuXuatChuyenKho> {
        return this.httpClient.post<PhieuXuatChuyenKho>(this.apiUrl, phieuxuatchuyenkho);
    }

    updatePhieuXuatChuyenKho(phieuxuatchuyenkho: PhieuXuatChuyenKho): Observable<PhieuXuatChuyenKho> {
        return this.httpClient.put<PhieuXuatChuyenKho>(this.apiUrl + `/${phieuxuatchuyenkho.id}`, phieuxuatchuyenkho);
    }

    deletePhieuXuatChuyenKho(id: number): Observable<PhieuXuatChuyenKho> {
        return this.httpClient.delete<PhieuXuatChuyenKho>(this.apiUrl + `/${id}`);
    }
}
