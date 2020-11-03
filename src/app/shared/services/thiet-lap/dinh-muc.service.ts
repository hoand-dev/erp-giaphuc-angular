import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DinhMuc } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DinhMucService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/dinhmuc';

    constructor(private httpClient: HttpClient) { super(); }

    findDinhMuc(id: number): Observable<DinhMuc> {
        return this.httpClient.get<DinhMuc>(this.apiUrl + `/${id}`);
    }

    findDinhMucs(): Observable<DinhMuc[]> {
        return this.httpClient.get<DinhMuc[]>(this.apiUrl);
    }

    addDinhMuc(dinhmuc: DinhMuc): Observable<DinhMuc> {
        return this.httpClient.post<DinhMuc>(this.apiUrl, dinhmuc);
    }

    updateDinhMuc(dinhmuc: DinhMuc): Observable<DinhMuc> {
        return this.httpClient.put<DinhMuc>(this.apiUrl + `/${dinhmuc.id}`, dinhmuc);
    }

    deleteDinhMuc(id: number): Observable<DinhMuc> {
        return this.httpClient.delete<DinhMuc>(this.apiUrl + `/${id}`);
    }
}