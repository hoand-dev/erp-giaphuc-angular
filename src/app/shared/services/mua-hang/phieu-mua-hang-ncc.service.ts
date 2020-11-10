import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuMuaHangNCC } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PhieuMuaHangNCCService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieumuahangncc';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuMuaHangNCC(id: number): Observable<PhieuMuaHangNCC> {
        return this.httpClient.get<PhieuMuaHangNCC>(this.apiUrl + `/${id}`);
    }

    findPhieuMuaHangNCCs(): Observable<PhieuMuaHangNCC[]> {
        return this.httpClient.get<PhieuMuaHangNCC[]>(this.apiUrl);
    }

    addPhieuMuaHangNCC(phieumuahangncc: PhieuMuaHangNCC): Observable<PhieuMuaHangNCC> {
        return this.httpClient.post<PhieuMuaHangNCC>(this.apiUrl, phieumuahangncc);
    }

    updatePhieuMuaHangNCC(phieumuahangncc: PhieuMuaHangNCC): Observable<PhieuMuaHangNCC> {
        return this.httpClient.put<PhieuMuaHangNCC>(this.apiUrl + `/${phieumuahangncc.id}`, phieumuahangncc);
    }

    deletePhieuMuaHangNCC(id: number): Observable<PhieuMuaHangNCC> {
        return this.httpClient.delete<PhieuMuaHangNCC>(this.apiUrl + `/${id}`);
    }
}