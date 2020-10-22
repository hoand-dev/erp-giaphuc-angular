import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DanhMucGiaCong } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DanhMucGiaCongService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/danhmucgiacong';

    constructor(private httpClient: HttpClient) { super(); }

    findDanhMucGiaCong(id: number): Observable<DanhMucGiaCong> {
        return this.httpClient.get<DanhMucGiaCong>(this.apiUrl + `/${id}`);
    }

    findDanhMucGiaCongs(): Observable<DanhMucGiaCong[]> {
        return this.httpClient.get<DanhMucGiaCong[]>(this.apiUrl);
    }

    addDanhMucGiaCong(danhmucgiacong: DanhMucGiaCong): Observable<DanhMucGiaCong> {
        return this.httpClient.post<DanhMucGiaCong>(this.apiUrl, danhmucgiacong);
    }

    updateDanhMucGiaCong(danhmucgiacong: DanhMucGiaCong): Observable<DanhMucGiaCong> {
        return this.httpClient.put<DanhMucGiaCong>(this.apiUrl + `/${danhmucgiacong.id}`, danhmucgiacong);
    }

    deleteDanhMucGiaCong(id: number): Observable<DanhMucGiaCong> {
        return this.httpClient.delete<DanhMucGiaCong>(this.apiUrl + `/${id}`);
    }
}