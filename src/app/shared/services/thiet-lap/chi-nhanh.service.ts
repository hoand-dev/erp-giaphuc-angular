import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChiNhanh } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChiNhanhService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/chinhanh';

    constructor(private httpClient: HttpClient) { super(); }

    findChiNhanh(id: number): Observable<ChiNhanh> {
        return this.httpClient.get<ChiNhanh>(this.apiUrl + `/${id}`);
    }

    findChiNhanhs(): Observable<ChiNhanh[]> {
        return this.httpClient.get<ChiNhanh[]>(this.apiUrl);
    }

    addChiNhanh(chinhanh: ChiNhanh): Observable<ChiNhanh> {
        return this.httpClient.post<ChiNhanh>(this.apiUrl, chinhanh);
    }

    updateChiNhanh(chinhanh: ChiNhanh): Observable<ChiNhanh> {
        return this.httpClient.put<ChiNhanh>(this.apiUrl + `/${chinhanh.id}`, chinhanh);
    }

    deleteChiNhanh(id: number): Observable<ChiNhanh> {
        return this.httpClient.delete<ChiNhanh>(this.apiUrl + `/${id}`);
    }

    existChiNhanh(machinhanh: string) {
        return this.httpClient.get<ChiNhanh>(this.apiUrl + `/${machinhanh}`);
    }
}
