import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {

    private apiUrl: string = environment.apiUrl + '/common';
    
    constructor(
        private httpClient: HttpClient
    ) { }

    isNotEmpty(value: any): boolean {
        return value !== undefined && value !== null && value !== "";
    }

    nhaCungCap_LoadNoCu(nhacungcap_id: number = null, sort: string = null): Observable<number> {
        return this.httpClient.get<number>(this.apiUrl + '/nhacungcap-loadnocu' + `?nhacungcap_id=${nhacungcap_id}&sort=${sort}`);
    }
}