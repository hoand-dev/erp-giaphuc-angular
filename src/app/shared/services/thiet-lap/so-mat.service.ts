import { BaseService } from '@app/shared/services';
import { HttpClient, HttpParams } from '@angular/common/http';
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

    findSoMats(kichhoat: boolean = true): Observable<SoMat[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
        return this.httpClient.get<SoMat[]>(this.apiUrl, { params: query_params });
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

    checkExistSoMat(masomat: string, masomat_old: string = null) {
        if (masomat == masomat_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?masomat=${masomat}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}