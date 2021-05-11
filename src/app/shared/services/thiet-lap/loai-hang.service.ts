import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaiHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoaiHangService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/loaihang';

    constructor(private httpClient: HttpClient) { super(); }

    findLoaiHang(id: number): Observable<LoaiHang> {
        return this.httpClient.get<LoaiHang>(this.apiUrl + `/${id}`);
    }

    findLoaiHangs(kichhoat: boolean = true): Observable<LoaiHang[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        return this.httpClient.get<LoaiHang[]>(this.apiUrl, { params: query_params });
    }

    addLoaiHang(loaihang: LoaiHang): Observable<LoaiHang> {
        return this.httpClient.post<LoaiHang>(this.apiUrl, loaihang);
    }

    updateLoaiHang(loaihang: LoaiHang): Observable<LoaiHang> {
        return this.httpClient.put<LoaiHang>(this.apiUrl + `/${loaihang.id}`, loaihang);
    }

    deleteLoaiHang(id: number): Observable<LoaiHang> {
        return this.httpClient.delete<LoaiHang>(this.apiUrl + `/${id}`);
    }
    checkLoaiHangExist(maloaihang: string,maloaihang_old: string = null) {
        if (maloaihang == maloaihang_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?maloaihang=${maloaihang}`)
                .toPromise()
                .then(
                    res => !res
                    ) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                    return false; // tuong duong da ton tai
                });
      }
}