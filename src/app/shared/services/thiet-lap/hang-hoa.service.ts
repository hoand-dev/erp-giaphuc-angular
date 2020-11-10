import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HangHoa } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HangHoaService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/hanghoa';

    constructor(private httpClient: HttpClient) { super(); }

    findHangHoa(id: number): Observable<HangHoa> {
        return this.httpClient.get<HangHoa>(this.apiUrl + `/${id}`);
    }

    findHangHoas(loaihanghoa: string = null): Observable<HangHoa[]> {
        if(loaihanghoa)
            return this.httpClient.get<HangHoa[]>(this.apiUrl + '?loaihanghoa=' + loaihanghoa);
        return this.httpClient.get<HangHoa[]>(this.apiUrl);
    }

    addHangHoa(hanghoa: HangHoa): Observable<HangHoa> {
        return this.httpClient.post<HangHoa>(this.apiUrl, hanghoa);
    }

    updateHangHoa(hanghoa: HangHoa): Observable<HangHoa> {
        return this.httpClient.put<HangHoa>(this.apiUrl + `/${hanghoa.id}`, hanghoa);
    }

    deleteHangHoa(id: number): Observable<HangHoa> {
        return this.httpClient.delete<HangHoa>(this.apiUrl + `/${id}`);
    }

    checkExistHangHoa(mahanghoa: string, mahanghoa_old: string = null) {
        if (mahanghoa == mahanghoa_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?mahanghoa=${mahanghoa}`)
                .toPromise()
                .then(res => !res) // false -> true (chưa tồn tại) và ngược lại
                .catch(err => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}