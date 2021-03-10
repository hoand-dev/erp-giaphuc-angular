import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import moment from 'moment';
import { ThongKeXuatNhapTon, ThongKeXuatNhapTonTrongNgay, ThongKeXuatNhapTon_ChiTiet, ThongKeXuatNhapTon_ChiTietPhieu } from '@app/shared/entities';

@Injectable({
    providedIn: 'root'
})
export class ThongKeKhoHangService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/thong-ke-kho-hang';

    constructor(private httpClient: HttpClient) {
        super();
    }
    
    findsXuatNhapTon_TrongNgay(ngayphatsinh:Date, chinhanh_id: number = null, khohang_id: number = null): Observable<ThongKeXuatNhapTonTrongNgay[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("ngayphatsinh", moment(ngayphatsinh).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("khohang_id", khohang_id ? khohang_id.toString() : null);
        
        return this.httpClient.get<ThongKeXuatNhapTonTrongNgay[]>(this.apiUrl + "/xuat-nhap-ton-trong-ngay", { params: query_params });
    }

    findsXuatNhapTon(fromDay:Date, toDay: Date, chinhanh_id: number = null, khohang_id: number = null): Observable<ThongKeXuatNhapTon[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("khohang_id", khohang_id ? khohang_id.toString() : null);
        
        return this.httpClient.get<ThongKeXuatNhapTon[]>(this.apiUrl + "/xuat-nhap-ton", { params: query_params });
    }

    findsXuatNhapTon_ChiTiet(fromDay:Date, toDay: Date, chinhanh_id: number, khohang_id: number, hanghoa_id: number): Observable<ThongKeXuatNhapTon_ChiTiet[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("khohang_id", khohang_id ? khohang_id.toString() : null);
        query_params = query_params.set("hanghoa_id", hanghoa_id.toString());
        
        return this.httpClient.get<ThongKeXuatNhapTon_ChiTiet[]>(this.apiUrl + "/xuat-nhap-ton-chi-tiet", { params: query_params });
    }

    findsXuatNhapTon_ChiTietPhieu(chinhanh_id: number, khohang_id: number, hanghoa_id: number, view: string): Observable<ThongKeXuatNhapTon_ChiTietPhieu[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("khohang_id", khohang_id ? khohang_id.toString() : null);
        query_params = query_params.set("hanghoa_id", hanghoa_id.toString());
        query_params = query_params.set("view", view);
        
        return this.httpClient.get<ThongKeXuatNhapTon_ChiTietPhieu[]>(this.apiUrl + "/xuat-nhap-ton-chi-tiet-phieu", { params: query_params });
    }
}
