import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DonViGiaCong } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DonViGiaCongService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/donvigiacong';

    constructor(private httpClient: HttpClient) { super(); }

    findDonViGiaCong(id: number): Observable<DonViGiaCong> {
        return this.httpClient.get<DonViGiaCong>(this.apiUrl + `/${id}`);
    }

    findDonViGiaCongs(): Observable<DonViGiaCong[]> {
        return this.httpClient.get<DonViGiaCong[]>(this.apiUrl);
    }

    addDonViGiaCong(donvigiacong: DonViGiaCong): Observable<DonViGiaCong> {
        return this.httpClient.post<DonViGiaCong>(this.apiUrl, donvigiacong);
    }

    updateDonViGiaCong(donvigiacong: DonViGiaCong): Observable<DonViGiaCong> {
        return this.httpClient.put<DonViGiaCong>(this.apiUrl + `/${donvigiacong.id}`, donvigiacong);
    }

    deleteDonViGiaCong(id: number): Observable<DonViGiaCong> {
        return this.httpClient.delete<DonViGiaCong>(this.apiUrl + `/${id}`);
    }
}