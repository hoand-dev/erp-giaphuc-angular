import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SoMat } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SoMatService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/somat';

    constructor(private httpClient: HttpClient) { super(); }

    findSoMat(id: number): Observable<SoMat> {
        return this.httpClient.get<SoMat>(this.apiUrl + `/${id}`);
    }

    findSoMats(): Observable<SoMat[]> {
        return this.httpClient.get<SoMat[]>(this.apiUrl);
    }

    addSoMat(somat: SoMat): Observable<SoMat> {
        return this.httpClient.post<SoMat>(this.apiUrl, somat);
    }

    updateSoMat(somat: SoMat): Observable<SoMat> {
        return this.httpClient.put<SoMat>(this.apiUrl + `/${somat.id}`, somat);
    }

    deleteSoMat(id: number): Observable<SoMat> {
        return this.httpClient.delete<SoMat>(this.apiUrl + `/${id}`);
    }
}