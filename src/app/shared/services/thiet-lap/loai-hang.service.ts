import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
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

    findLoaiHangs(): Observable<LoaiHang[]> {
        return this.httpClient.get<LoaiHang[]>(this.apiUrl);
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
}