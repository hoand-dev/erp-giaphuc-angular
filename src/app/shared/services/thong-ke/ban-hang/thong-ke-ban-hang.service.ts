import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThongKeBanHangChiTiet, ThongKeXuatBanChiTiet } from '@app/shared/entities';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BaseService } from '../..';

@Injectable({
  providedIn: 'root'
})
export class ThongKeBanHangChiTietService extends BaseService{

    private apiUrl: string = environment.apiUrl + '/thong-ke-ban-hang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuBanHangs(fromDay:Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeBanHangChiTiet[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeBanHangChiTiet[]>(this.apiUrl + "/chi-tiet", { params: query_params });
    }

    findXuatBanChiTiets(fromDay:Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeXuatBanChiTiet[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeXuatBanChiTiet[]>(this.apiUrl + "/chi-tiet-xuat", { params: query_params });
    }

}
