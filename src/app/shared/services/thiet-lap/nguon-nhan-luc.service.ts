import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NguonNhanLuc } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NguonNhanLucService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/nguonnhanluc';

    constructor(private httpClient: HttpClient) { super(); }

    findNguonNhanLuc(id: number): Observable<NguonNhanLuc> {
        return this.httpClient.get<NguonNhanLuc>(this.apiUrl + `/${id}`);
    }

    findNguonNhanLucs(): Observable<NguonNhanLuc[]> {
        return this.httpClient.get<NguonNhanLuc[]>(this.apiUrl);
    }

    addNguonNhanLuc(nguonnhanluc: NguonNhanLuc): Observable<NguonNhanLuc> {
        return this.httpClient.post<NguonNhanLuc>(this.apiUrl, nguonnhanluc);
    }

    updateNguonNhanLuc(nguonnhanluc: NguonNhanLuc): Observable<NguonNhanLuc> {
        return this.httpClient.put<NguonNhanLuc>(this.apiUrl + `/${nguonnhanluc.id}`, nguonnhanluc);
    }

    deleteNguonNhanLuc(id: number): Observable<NguonNhanLuc> {
        return this.httpClient.delete<NguonNhanLuc>(this.apiUrl + `/${id}`);
    }
}