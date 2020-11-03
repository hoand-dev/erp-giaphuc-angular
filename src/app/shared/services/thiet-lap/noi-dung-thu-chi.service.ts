import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NoiDungThuChi } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NoiDungThuChiService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/noidungthuchi';

    constructor(private httpClient: HttpClient) { super(); }

    findNoiDungThuChi(id: number): Observable<NoiDungThuChi> {
        return this.httpClient.get<NoiDungThuChi>(this.apiUrl + `/${id}`);
    }

    findNoiDungThuChis(): Observable<NoiDungThuChi[]> {
        return this.httpClient.get<NoiDungThuChi[]>(this.apiUrl);
    }

    addNoiDungThuChi(noidungthuchi: NoiDungThuChi): Observable<NoiDungThuChi> {
        return this.httpClient.post<NoiDungThuChi>(this.apiUrl, noidungthuchi);
    }

    updateNoiDungThuChi(noidungthuchi: NoiDungThuChi): Observable<NoiDungThuChi> {
        return this.httpClient.put<NoiDungThuChi>(this.apiUrl + `/${noidungthuchi.id}`, noidungthuchi);
    }

    deleteNoiDungThuChi(id: number): Observable<NoiDungThuChi> {
        return this.httpClient.delete<NoiDungThuChi>(this.apiUrl + `/${id}`);
    }
}