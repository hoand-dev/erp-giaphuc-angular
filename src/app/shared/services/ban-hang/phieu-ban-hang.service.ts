import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuBanHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PhieuBanHangService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/phieubanhang';

    constructor(private httpClient: HttpClient) { super(); }
		
		findPhieuBanHang(id: number): Observable<PhieuBanHang> {
        return this.httpClient.get<PhieuBanHang>(this.apiUrl + `/${id}`);
    }
		
		findPhieuBanHangs(): Observable<PhieuBanHang[]> {
        return this.httpClient.get<PhieuBanHang[]>(this.apiUrl);
    }

    addPhieuBanHang(phieubanhang: PhieuBanHang): Observable<PhieuBanHang> {
        return this.httpClient.post<PhieuBanHang>(this.apiUrl, phieubanhang);
    }

    updatePhieuBanHang(phieubanhang: PhieuBanHang): Observable<PhieuBanHang> {
        return this.httpClient.put<PhieuBanHang>(this.apiUrl + `/${phieubanhang.id}`, phieubanhang);
    }

    deletePhieuBanHang(id: number): Observable<PhieuBanHang> {
        return this.httpClient.delete<PhieuBanHang>(this.apiUrl + `/${id}`);
    }
}
