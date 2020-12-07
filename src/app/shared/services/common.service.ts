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

    nhaCungCap_LoadNoCu(nhacungcap_id: number = null, sort: string = null): Observable<number> {
        return this.httpClient.get<number>(this.apiUrl + '/nhacungcap-loadnocu' + `?nhacungcap_id=${nhacungcap_id}&sort=${sort}`);
    }

    khachHang_LoadNoCu(khachhang_id: number = null, sort: string = null): Observable<number> {
        return this.httpClient.get<number>(this.apiUrl + '/khachhang-loadnocu' + `?khachhang_id=${khachhang_id}&sort=${sort}`);
    }
    
    hangHoa_TonKhoHienTai(chinhanh_id: number = null, khohang_id: number = null, loaihanghoa: string = null, loadOptions: LoadOptions): Observable<HangHoa[]> {
        let params: HttpParams = new HttpParams();
        [
            "skip",
            "take",
            "sort",
            "filter",
            "searchExpr",
            "searchOperation",
            "searchValue",
            "group",
        ].forEach((i) => {
            if (i in loadOptions && this.isNotEmpty(loadOptions[i]))
                params = params.set(i, JSON.stringify(loadOptions[i]));
        });
        
        params = params.set("chinhanh_id", chinhanh_id.toString());
        params = params.set("khohang_id", khohang_id ? khohang_id.toString() : null);
        
        if(loaihanghoa) params = params.set("loaihanghoa", loaihanghoa);

        if(params.get("searchValue") == null ){
            params = params.set("searchValue", " ");
        }
        return this.httpClient.get<HangHoa[]>(this.apiUrl + '/hanghoa-tonkhohientai', { params: params });
    }
}
