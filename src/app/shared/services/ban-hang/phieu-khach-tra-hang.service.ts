import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuKhachTraHang } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PhieuKhachTraHangService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/phieukhachtrahang';

    constructor(private httpClient: HttpClient) { super(); }
		
		findPhieuKhachTraHang(id: number): Observable<PhieuKhachTraHang> {
        return this.httpClient.get<PhieuKhachTraHang>(this.apiUrl + `/${id}`);
    }
		
		findPhieuKhachTraHangs(): Observable<PhieuKhachTraHang[]> {
        return this.httpClient.get<PhieuKhachTraHang[]>(this.apiUrl);
    }

    addPhieuKhachTraHang(phieukhachtrahang: PhieuKhachTraHang): Observable<PhieuKhachTraHang> {
        return this.httpClient.post<PhieuKhachTraHang>(this.apiUrl, phieukhachtrahang);
    }

    updatePhieuKhachTraHang(phieukhachtrahang: PhieuKhachTraHang): Observable<PhieuKhachTraHang> {
        return this.httpClient.put<PhieuKhachTraHang>(this.apiUrl + `/${phieukhachtrahang.id}`, phieukhachtrahang);
    }

    deletePhieuKhachTraHang(id: number): Observable<PhieuKhachTraHang> {
        return this.httpClient.delete<PhieuKhachTraHang>(this.apiUrl + `/${id}`);
    }
}
