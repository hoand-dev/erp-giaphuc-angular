import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { LoadOptions } from 'devextreme/data/load_options';
import { Observable } from 'rxjs';
import { HangHoa } from '../entities';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private apiUrl: string = environment.apiUrl + '/common';

    constructor(private httpClient: HttpClient) {}

    isNotEmpty(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
    }

    getEnablePermission(permissions: any[], permission: string){
        let per = permissions.filter(x => x.maquyen == permission);
        return per.length == 1 ? true : false;
    }

    timKiem_QuyenDuocCap(): Observable<any[]>{
        return this.httpClient.get<any[]>(this.apiUrl + '/nguoidung-quyenduoccap');
    }

    timKiem_Menu(): Observable<any[]>{
        return this.httpClient.get<any[]>(this.apiUrl + '/nguoidung-menu');
    }

    donViGiaCong_LoadNoCu(donvigiacong_id: number, chinhanh_id: number = null, sort: string = null): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('donvigiacong_id', donvigiacong_id ? donvigiacong_id.toString() : null);
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('sort', sort);

        return this.httpClient.get<number>(this.apiUrl + '/donvigiacong-loadnocu', { params: query_params });
    }

    nhaCungCap_LoadNoCu(nhacungcap_id: number, chinhanh_id: number = null, sort: string = null): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('nhacungcap_id', nhacungcap_id ? nhacungcap_id.toString() : null);
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('sort', sort);

        return this.httpClient.get<number>(this.apiUrl + '/nhacungcap-loadnocu', { params: query_params });
    }

    khachHang_LoadNoCu(khachhang_id: number = null, chinhanh_id: number = null, sort: string = null): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('khachhang_id', khachhang_id ? khachhang_id.toString() : null);
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);
        query_params = query_params.set('sort', sort);

        return this.httpClient.get<number>(this.apiUrl + '/khachhang-loadnocu', { params: query_params });
    }
    
    hangHoa_LayGia_NhapKho(nhacungcap_id: number = null, hanghoa_id: number = null): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('nhacungcap_id', nhacungcap_id ? nhacungcap_id.toString() : null);
        query_params = query_params.set('hanghoa_id', hanghoa_id ? hanghoa_id.toString() : null);

        return this.httpClient.get<number>(this.apiUrl + '/hanghoa-laygia-nhapkho', { params: query_params });
    }
    
    hangHoa_LayGia_XuatKho(khachhang_id: number = null, hanghoa_id: number = null): Observable<number> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('khachhang_id', khachhang_id ? khachhang_id.toString() : null);
        query_params = query_params.set('hanghoa_id', hanghoa_id ? hanghoa_id.toString() : null);

        return this.httpClient.get<number>(this.apiUrl + '/hanghoa-laygia-xuatkho', { params: query_params });
    }

    hangHoa_TonKhoHienTai(chinhanh_id: number = null, khohang_id: number = null, loaihanghoa: string = null, loadOptions: LoadOptions = null): Observable<HangHoa[]> {
        let query_params: HttpParams = new HttpParams();
        if(loadOptions){
            ['skip', 'take', 'sort', 'filter', 'searchExpr', 'searchOperation', 'searchValue', 'group'].forEach((i) => {
                if (i in loadOptions && this.isNotEmpty(loadOptions[i])) query_params = query_params.set(i, JSON.stringify(loadOptions[i]));
            });
        }
        

        query_params = query_params.set('chinhanh_id', chinhanh_id.toString());
        query_params = query_params.set('khohang_id', khohang_id ? khohang_id.toString() : null);

        if (loaihanghoa) query_params = query_params.set('loaihanghoa', loaihanghoa);

        if (query_params.get('searchValue') == null) {
            query_params = query_params.set('searchValue', ' ');
        }
        return this.httpClient.get<HangHoa[]>(this.apiUrl + '/hanghoa-tonkhohientai', { params: query_params });
    }
}
