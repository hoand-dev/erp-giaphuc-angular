import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { ThongKeCongNoKhachHang, ThongKeCongNoNhaCungCap, ThongKeCongNoQuaHan } from '@app/shared/entities';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class ThongKeCongNoService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/thong-ke-cong-no';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findsCongNo_QuaHan(chinhanh_id: number = null): Observable<ThongKeCongNoQuaHan[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeCongNoQuaHan[]>(this.apiUrl + "/qua-han", { params: query_params });
    }

    findsCongNo_KhachHang(fromDay:Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeCongNoKhachHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeCongNoKhachHang[]>(this.apiUrl + "/khach-hang", { params: query_params });
    }

    findsCongNo_NhaCungCap(fromDay:Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeCongNoNhaCungCap[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeCongNoNhaCungCap[]>(this.apiUrl + "/nha-cung-cap", { params: query_params });
    }
}
