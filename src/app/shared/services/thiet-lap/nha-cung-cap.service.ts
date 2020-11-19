import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NhaCungCap } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NhaCungCapService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/nhacungcap';

    constructor(private httpClient: HttpClient) { super(); }
		
		findNhaCungCap(id: number): Observable<NhaCungCap> {
        return this.httpClient.get<NhaCungCap>(this.apiUrl + `/${id}`);
    }
		
		findNhaCungCaps(): Observable<NhaCungCap[]> {
        return this.httpClient.get<NhaCungCap[]>(this.apiUrl);
    }

    addNhaCungCap(nhacungcap: NhaCungCap): Observable<NhaCungCap> {
        return this.httpClient.post<NhaCungCap>(this.apiUrl, nhacungcap);
    }

    updateNhaCungCap(nhacungcap: NhaCungCap): Observable<NhaCungCap> {
        return this.httpClient.put<NhaCungCap>(this.apiUrl + `/${nhacungcap.id}`, nhacungcap);
    }

    deleteNhaCungCap(id: number): Observable<NhaCungCap> {
        return this.httpClient.delete<NhaCungCap>(this.apiUrl + `/${id}`);
    }
    checkExistNhaCungCap(manhacungcap: string, manhacungcap_old: string = null){
        if(manhacungcap == manhacungcap_old){
            return new Promise((resolve) =>{
                setTimeout( function(){
                    resolve(true);
                },300 );
            });
        }else{
            return this.httpClient.get(this.apiUrl + `/exist?manhacungcap=${manhacungcap}`)
            .toPromise()
            .then(res => !res )
            .catch(err =>{
                console.error(err);
                this.handleError(err);
            });
        }
    }
}