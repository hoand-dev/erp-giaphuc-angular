import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ThongKeTyLeHangLoi, TinhHinhSanXuat_DonDatHang, TinhHinhXuatKho_DonDatHang } from '@app/shared/entities';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service';

@Injectable({
    providedIn: 'root'
})
export class ThongKeSanXuatService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/thong-ke-san-xuat';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findsTyLeHangLoi(fromDay: Date, toDay: Date, chinhanh_id: number = null): Observable<ThongKeTyLeHangLoi[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        return this.httpClient.get<ThongKeTyLeHangLoi[]>(this.apiUrl + '/ty-le-hang-loi', { params: query_params });
    }

    findsTinhHinhSanXuat_DonHang(fromDay: Date, toDay: Date, chinhanh_id: number = null): Observable<TinhHinhSanXuat_DonDatHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        return this.httpClient.get<TinhHinhSanXuat_DonDatHang[]>(this.apiUrl + '/tinh-hinh-san-xuat-don-hang', { params: query_params });
    }

    findsTinhHinhXuatKho_DonHang(fromDay: Date, toDay: Date, chinhanh_id: number = null): Observable<TinhHinhXuatKho_DonDatHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        return this.httpClient.get<TinhHinhXuatKho_DonDatHang[]>(this.apiUrl + '/tinh-hinh-xuat-kho-don-hang', { params: query_params });
    }

}
