import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BaseService } from '@app/shared/services';
import { LichSu, PhieuNhapKho, PhieuXuatKho } from '@app/shared/entities';

@Injectable({
    providedIn: 'root'
})
export class LichSuService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/he-thong';

    constructor(private httpClient: HttpClient) {
        super();
    }

    finds(fromDay: Date, toDay: Date, chinhanh_id: number = null): Observable<LichSu[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);

        return this.httpClient.get<LichSu[]>(this.apiUrl + '/lich-su', { params: query_params });
    }

    findNhapKho(master_id: number): Observable<PhieuNhapKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuNhapKho>(this.apiUrl + '/lich-su-nhap-kho', { params: query_params });
    }

    findXuatKho(master_id: number): Observable<PhieuXuatKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuXuatKho>(this.apiUrl + '/lich-su-xuat-kho', { params: query_params });
    }
}
