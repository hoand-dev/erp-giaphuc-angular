import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuThu, PhieuThu_PhieuXuatKho } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class PhieuThuService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieuthu';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuThu(id: number): Observable<PhieuThu> {
        return this.httpClient.get<PhieuThu>(this.apiUrl + `/${id}`);
    }

    findPhieuThus(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuThu[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));

        return this.httpClient.get<PhieuThu[]>(this.apiUrl, { params: query_params });
    }

    findPhieuXuatKhos(chinhanh_id: number, khachhang_id?: number, nhacungcap_id?:number): Observable<PhieuThu_PhieuXuatKho[]>{
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("khachhang_id", khachhang_id ? khachhang_id.toString() : null);
        query_params = query_params.set("nhacungcap_id", nhacungcap_id ? nhacungcap_id.toString() : null);
        
        return this.httpClient.get<PhieuThu_PhieuXuatKho[]>(this.apiUrl + "/phieu-xuat-kho", { params: query_params });
    }

    addPhieuThu(phieuthu: PhieuThu): Observable<PhieuThu> {
        return this.httpClient.post<PhieuThu>(this.apiUrl, phieuthu);
    }

    updatePhieuThu(phieuthu: PhieuThu): Observable<PhieuThu> {
        return this.httpClient.put<PhieuThu>(this.apiUrl + `/${phieuthu.id}`, phieuthu);
    }

    deletePhieuThu(id: number): Observable<PhieuThu> {
        return this.httpClient.delete<PhieuThu>(this.apiUrl + `/${id}`);
    }
}
