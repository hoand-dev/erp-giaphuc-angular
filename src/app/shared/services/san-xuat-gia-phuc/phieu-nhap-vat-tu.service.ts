import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuNhapVatTu } from '@app/shared/entities';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BaseService } from '..';

@Injectable({
  providedIn: 'root'
})
export class PhieuNhapVatTuService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieunhapvattu';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuNhapVatTu(id: number): Observable<PhieuNhapVatTu> {
        return this.httpClient.get<PhieuNhapVatTu>(this.apiUrl + `/${id}`);
    }

    findPhieuNhapVatTus(chinhanh_id: number = null, fromDay:Date, toDay: Date): Observable<PhieuNhapVatTu[]> {
        let query_chinhanh = chinhanh_id == null ? "?" : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format("YYYY-MM-DD HH:mm:ss");
        let denngay = moment(toDay).format("YYYY-MM-DD HH:mm:ss");
        return this.httpClient.get<PhieuNhapVatTu[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addPhieuNhapVatTu(phieunhapnhattu: PhieuNhapVatTu): Observable<PhieuNhapVatTu> {
        return this.httpClient.post<PhieuNhapVatTu>(this.apiUrl, phieunhapnhattu);
    }

    updatePhieuNhapVatTu(phieunhapnhattu: PhieuNhapVatTu, tattoan: boolean=false): Observable<PhieuNhapVatTu> {
        return this.httpClient.put<PhieuNhapVatTu>(this.apiUrl + `/${ (tattoan ? `tattoan`: phieunhapnhattu.id) }`, PhieuNhapVatTu);
    }

    deletePhieuNhapVatTu(id: number): Observable<PhieuNhapVatTu> {
        return this.httpClient.delete<PhieuNhapVatTu>(this.apiUrl + `/${id}`);
    }

    checkExistPhieuNhapVatTu(phieunhapnhattu: string, phieunhapnhattu_old: string = null) {
        if (phieunhapnhattu == phieunhapnhattu_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                });
            });
        else
            return this.httpClient
                .get(this.apiUrl + `/exist?phieunhapnhattu=${phieunhapnhattu}`)
                .toPromise()
                .then((res) => !res ) // false -> true (chưa tồn tại) và ngược lại
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
    }

    // laygiaPhieuNhapVatTu(hanghoa_id: number, donvigiacong_id?: number): Observable<number> {
    //     let query_params: HttpParams = new HttpParams();
    //     query_params = query_params.set("hanghoa_id", hanghoa_id.toString());
    //     query_params = query_params.set("donvigiacong_id", donvigiacong_id != null? donvigiacong_id.toString() : null);

    //     return this.httpClient.get<number>(this.apiUrl + `/laygia`, { params: query_params });
    // }
}


