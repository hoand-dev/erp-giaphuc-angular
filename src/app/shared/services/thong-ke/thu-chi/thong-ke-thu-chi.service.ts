import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import moment from 'moment';
import { ThongKeNoiDungThuChi, ThongKeThuChiTonQuy } from '@app/shared/entities';

@Injectable({
    providedIn: 'root'
})
export class ThongKeThuChiService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/thong-ke-thu-chi';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findsThuChi_NoiDung(fromDay:Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeNoiDungThuChi[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeNoiDungThuChi[]>(this.apiUrl + "/noi-dung", { params: query_params });
    }

    findsThuChi_TonQuy(fromDay:Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeThuChiTonQuy[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set("tungay", moment(fromDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("denngay", moment(toDay).format("YYYY-MM-DD HH:mm:ss"));
        query_params = query_params.set("chinhanh_id", chinhanh_id ? chinhanh_id.toString() : null);
        
        return this.httpClient.get<ThongKeThuChiTonQuy[]>(this.apiUrl + "/ton-quy", { params: query_params });
    }
}
