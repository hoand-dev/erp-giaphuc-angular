import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhieuTraHangNCC } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PhieuTraHangNCCService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/phieutrahangncc';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findPhieuTraHangNCC(id: number): Observable<PhieuTraHangNCC> {
        return this.httpClient.get<PhieuTraHangNCC>(this.apiUrl + `/${id}`);
    }

    findPhieuTraHangNCCs(): Observable<PhieuTraHangNCC[]> {
        return this.httpClient.get<PhieuTraHangNCC[]>(this.apiUrl);
    }

    addPhieuTraHangNCC(phieutrahangncc: PhieuTraHangNCC): Observable<PhieuTraHangNCC> {
        return this.httpClient.post<PhieuTraHangNCC>(this.apiUrl, phieutrahangncc);
    }

    updatePhieuTraHangNCC(phieutrahangncc: PhieuTraHangNCC): Observable<PhieuTraHangNCC> {
        return this.httpClient.put<PhieuTraHangNCC>(this.apiUrl + `/${phieutrahangncc.id}`, phieutrahangncc);
    }

    deletePhieuTraHangNCC(id: number): Observable<PhieuTraHangNCC> {
        return this.httpClient.delete<PhieuTraHangNCC>(this.apiUrl + `/${id}`);
    }
}