import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BangGia } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BangGiaService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/banggia';

    constructor(private httpClient: HttpClient) { super(); }
		
		findBangGia(id: number): Observable<BangGia> {
        return this.httpClient.get<BangGia>(this.apiUrl + `/${id}`);
    }
		
		findBangGias(): Observable<BangGia[]> {
        return this.httpClient.get<BangGia[]>(this.apiUrl);
    }

    addBangGia(banggia: BangGia): Observable<BangGia> {
        return this.httpClient.post<BangGia>(this.apiUrl, banggia);
    }

    updateBangGia(banggia: BangGia): Observable<BangGia> {
        return this.httpClient.put<BangGia>(this.apiUrl + `/${banggia.id}`, banggia);
    }

    deleteBangGia(id: number): Observable<BangGia> {
        return this.httpClient.delete<BangGia>(this.apiUrl + `/${id}`);
    }
}
