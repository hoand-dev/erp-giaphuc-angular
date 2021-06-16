import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PhieuXuatVatTu } from '@app/shared/entities';
import { Observable } from 'rxjs';
import { BaseService } from '..';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PhieuXuatVatTuService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/phieuxuatvattu';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuXuatVatTu(id: number): Observable<PhieuXuatVatTu> {
        return this.httpClient.get<PhieuXuatVatTu>(this.apiUrl + `/${id}`);
    }

    findPhieuXuatVatTus(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuXuatVatTu[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuXuatVatTu[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuXuatVatTu(phieuxuatvatu: PhieuXuatVatTu): Observable<PhieuXuatVatTu> {
        return this.httpClient.post<PhieuXuatVatTu>(this.apiUrl, phieuxuatvatu);
    }

    updatePhieuXuatVatTu(phieuxuatvattu: PhieuXuatVatTu, tattoan: boolean=false): Observable<PhieuXuatVatTu> {
        return this.httpClient.put<PhieuXuatVatTu>(this.apiUrl + `/${ (tattoan ? `tattoan`: phieuxuatvattu.id) }`, phieuxuatvattu);
    }

    deletePhieuXuatVatTu(id: number): Observable<PhieuXuatVatTu> {
        return this.httpClient.delete<PhieuXuatVatTu>(this.apiUrl + `/${id}`);
    }

    checkExistPhieuXuatVatTu(phieuxuatvattu: string, phieuxuatvattu_old: string = null) {
        if (phieuxuatvattu == phieuxuatvattu_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                });
            });
        else
            return this.httpClient
                .get(this.apiUrl + `/exist?phieuxuatvattu=${phieuxuatvattu}`)
                .toPromise()
                .then((res) => !res ) // false -> true (chưa tồn tại) và ngược lại
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
    }

    // laygiaPhieuXuatVatTu(hanghoa_id: number, donvigiacong_id?: number): Observable<number> {
    //     let query_params: HttpParams = new HttpParams();
    //     query_params = query_params.set("hanghoa_id", hanghoa_id.toString());
    //     query_params = query_params.set("donvigiacong_id", donvigiacong_id != null? donvigiacong_id.toString() : null);

    //     return this.httpClient.get<number>(this.apiUrl + `/laygia`, { params: query_params });
    // }
}
