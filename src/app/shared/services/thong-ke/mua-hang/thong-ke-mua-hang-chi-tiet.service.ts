import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThongKeMuaHangChiTiet } from '@app/shared/entities';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BaseService } from '../..';

@Injectable({
  providedIn: 'root'
})
export class ThongKeMuaHangChiTietService extends BaseService{

    private apiUrl: string = environment.apiUrl + '/thong-ke-mua-hang';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuMuaHangs(fromDay:Date, toDay: Date, chinhanh_id: number = null, nhacungcap_id: number = null): Observable<ThongKeMuaHangChiTiet[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set("nhacungcap_id", nhacungcap_id ? nhacungcap_id.toString() : null);
        
        return this.httpClient.get<ThongKeMuaHangChiTiet[]>(this.apiUrl + "/chi-tiet", { params: query_params });
    }

}
