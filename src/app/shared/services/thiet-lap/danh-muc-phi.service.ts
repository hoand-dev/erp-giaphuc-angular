import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DanhMucPhi } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DanhMucPhiService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/danhmucphi';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findDanhMucPhi(id: number): Observable<DanhMucPhi> {
        return this.httpClient.get<DanhMucPhi>(this.apiUrl + `/${id}`);
    }

    findDanhMucPhis(kichhoat: boolean = true): Observable<DanhMucPhi[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        return this.httpClient.get<DanhMucPhi[]>(this.apiUrl, { params: query_params });
    }

    addDanhMucPhi(danhmucphi: DanhMucPhi): Observable<DanhMucPhi> {
        return this.httpClient.post<DanhMucPhi>(this.apiUrl, danhmucphi);
    }

    updateDanhMucPhi(danhmucphi: DanhMucPhi): Observable<DanhMucPhi> {
        return this.httpClient.put<DanhMucPhi>(this.apiUrl + `/${danhmucphi.id}`, danhmucphi);
    }

    deleteDanhMucPhi(id: number): Observable<DanhMucPhi> {
        return this.httpClient.delete<DanhMucPhi>(this.apiUrl + `/${id}`);
    }

    checkExistDanhMucPhi(madanhmucphi: string, madanhmucphi_old: string = null) {
        if (madanhmucphi == madanhmucphi_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient
                .get(this.apiUrl + `/exist?madanhmucphi=${madanhmucphi}`)
                .toPromise()
                .then((res) => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}
