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
}
