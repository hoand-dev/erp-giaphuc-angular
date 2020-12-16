import { Observable } from 'rxjs';
import moment from 'moment';

import { environment } from '@environments/environment';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuChi, PhieuChi_PhieuNhapKho } from '../../entities/ke-toan/phieu-chi';
import { BaseService } from '../base-service';


@Injectable({
  providedIn: 'root'
})
export class PhieuChiService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/PhieuChi';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuChi(id: number): Observable<PhieuChi> {
        return this.httpClient.get<PhieuChi>(this.apiUrl + `/${id}`);
    }

    findPhieuChis(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuChi[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuChi[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    findPhieuNhapKhos(chinhanh_id: number, khachhang_id?: number, nhacungcap_id?:number): Observable<PhieuChi_PhieuNhapKho[]>{
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("khachhang_id", khachhang_id ? khachhang_id.toString() : null);
        query_params = query_params.set("nhacungcap_id", nhacungcap_id ? nhacungcap_id.toString() : null);
        
        return this.httpClient.get<PhieuChi_PhieuNhapKho[]>(this.apiUrl + "/phieu-nhap-kho", { params: query_params });
    }

    addPhieuChi(PhieuChi: PhieuChi): Observable<PhieuChi> {
        return this.httpClient.post<PhieuChi>(this.apiUrl, PhieuChi);
    }

    updatePhieuChi(PhieuChi: PhieuChi): Observable<PhieuChi> {
        return this.httpClient.put<PhieuChi>(this.apiUrl + `/${PhieuChi.id}`, PhieuChi);
    }

    deletePhieuChi(id: number): Observable<PhieuChi> {
        return this.httpClient.delete<PhieuChi>(this.apiUrl + `/${id}`);
    }
}
