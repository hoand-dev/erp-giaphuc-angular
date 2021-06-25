import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HangHoa, HangHoaDonViTinh, HangHoa_LoHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HangHoaService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/hanghoa';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findHangHoa(id: number): Observable<HangHoa> {
        return this.httpClient.get<HangHoa>(this.apiUrl + `/${id}`);
    }

    findHangHoas(loaihanghoa: string = null, kichhoat: boolean = true): Observable<HangHoa[]> {
        let query_params: HttpParams = new HttpParams();
        if (loaihanghoa) {
            query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
            query_params = query_params.set('loaihanghoa', loaihanghoa);
            return this.httpClient.get<HangHoa[]>(this.apiUrl, { params: query_params });
        } else {
            query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
            return this.httpClient.get<HangHoa[]>(this.apiUrl, { params: query_params });
        }
    }

    findLoHang(hanghoa_lohang_id: number): Observable<HangHoa_LoHang> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('hanghoa_lohang_id', hanghoa_lohang_id ? hanghoa_lohang_id.toString() : null);
        return this.httpClient.get<HangHoa_LoHang>(this.apiUrl + `/lo-hang`, { params: query_params });
    }

    findLoHangs(hanghoa_id: number): Observable<HangHoa_LoHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('hanghoa_id', hanghoa_id ? hanghoa_id.toString() : null);
        return this.httpClient.get<HangHoa_LoHang[]>(this.apiUrl + "/danh-sach-lo-hang", { params: query_params });
    }
    
    findHangHoaDvt(hanghoa_id: number, dvt_id: number): Observable<HangHoaDonViTinh> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('hanghoa_id', hanghoa_id ? hanghoa_id.toString() : null);
        query_params = query_params.set('dvt_id', dvt_id ? dvt_id.toString() : null);
        return this.httpClient.get<HangHoaDonViTinh>(this.apiUrl + `/hanghoadvt`, { params: query_params });
    }

    findHangHoaDvts(hanghoa_id: number): Observable<HangHoaDonViTinh[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('hanghoa_id', hanghoa_id ? hanghoa_id.toString() : null);
        return this.httpClient.get<HangHoaDonViTinh[]>(this.apiUrl + "/hanghoadvts", { params: query_params });
    }

    addHangHoa(hanghoa: HangHoa): Observable<HangHoa> {
        return this.httpClient.post<HangHoa>(this.apiUrl, hanghoa);
    }

    updateHangHoa(hanghoa: HangHoa): Observable<HangHoa> {
        return this.httpClient.put<HangHoa>(this.apiUrl + `/${hanghoa.id}`, hanghoa);
    }

    deleteHangHoa(id: number): Observable<HangHoa> {
        return this.httpClient.delete<HangHoa>(this.apiUrl + `/${id}`);
    }

    checkExistHangHoa(mahanghoa: string, mahanghoa_old: string = null) {
        if (mahanghoa == mahanghoa_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient
                .get(this.apiUrl + `/exist?mahanghoa=${mahanghoa}`)
                .toPromise()
                .then((res) => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}
