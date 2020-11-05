import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DonViTinh } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DonViTinhService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/donvitinh';

    constructor(private httpClient: HttpClient) { super(); }

    findDonViTinh(id: number): Observable<DonViTinh> {
        return this.httpClient.get<DonViTinh>(this.apiUrl + `/${id}`);
    }

    findDonViTinhs(): Observable<DonViTinh[]> {
        return this.httpClient.get<DonViTinh[]>(this.apiUrl);
    }

    addDonViTinh(donvitinh: DonViTinh): Observable<DonViTinh> {
        return this.httpClient.post<DonViTinh>(this.apiUrl, donvitinh);
    }

    updateDonViTinh(donvitinh: DonViTinh): Observable<DonViTinh> {
        return this.httpClient.put<DonViTinh>(this.apiUrl + `/${donvitinh.id}`, donvitinh);
    }

    deleteDonViTinh(id: number): Observable<DonViTinh> {
        return this.httpClient.delete<DonViTinh>(this.apiUrl + `/${id}`);
    }
}