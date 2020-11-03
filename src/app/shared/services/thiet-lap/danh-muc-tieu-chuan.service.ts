import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DanhMucTieuChuan } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DanhMucTieuChuanService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/danhmuctieuchuan';

    constructor(private httpClient: HttpClient) { super(); }

    findDanhMucTieuChuan(id: number): Observable<DanhMucTieuChuan> {
        return this.httpClient.get<DanhMucTieuChuan>(this.apiUrl + `/${id}`);
    }

    findDanhMucTieuChuans(): Observable<DanhMucTieuChuan[]> {
        return this.httpClient.get<DanhMucTieuChuan[]>(this.apiUrl);
    }

    addDanhMucTieuChuan(danhmuctieuchuan: DanhMucTieuChuan): Observable<DanhMucTieuChuan> {
        return this.httpClient.post<DanhMucTieuChuan>(this.apiUrl, danhmuctieuchuan);
    }

    updateDanhMucTieuChuan(danhmuctieuchuan: DanhMucTieuChuan): Observable<DanhMucTieuChuan> {
        return this.httpClient.put<DanhMucTieuChuan>(this.apiUrl + `/${danhmuctieuchuan.id}`, danhmuctieuchuan);
    }

    deleteDanhMucTieuChuan(id: number): Observable<DanhMucTieuChuan> {
        return this.httpClient.delete<DanhMucTieuChuan>(this.apiUrl + `/${id}`);
    }
}