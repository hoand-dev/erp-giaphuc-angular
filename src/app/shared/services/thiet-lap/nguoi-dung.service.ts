import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NguoiDung } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { User } from '@app/_models';

@Injectable({
    providedIn: 'root'
})
export class NguoiDungService extends BaseService {

    private apiUrl: string = environment.apiUrl + '/nguoidung';

    constructor(private httpClient: HttpClient) { super(); }

    getCurrentUser(): Observable<User> {
        return this.httpClient.get<User>(environment.apiUrl + '/auth-current');
    }

    findNguoiDung(id: number): Observable<NguoiDung> {
        return this.httpClient.get<NguoiDung>(this.apiUrl + `/${id}`);
    }

    findNguoiDungs(): Observable<NguoiDung[]> {
        return this.httpClient.get<NguoiDung[]>(this.apiUrl);
    }

    addNguoiDung(nguoidung: NguoiDung): Observable<NguoiDung> {
        return this.httpClient.post<NguoiDung>(this.apiUrl, nguoidung);
    }

    updateNguoiDung(nguoidung: NguoiDung): Observable<NguoiDung> {
        return this.httpClient.put<NguoiDung>(this.apiUrl + `/${nguoidung.id}`, nguoidung);
    }

    deleteNguoiDung(id: number): Observable<NguoiDung> {
        return this.httpClient.delete<NguoiDung>(this.apiUrl + `/${id}`);
    }
}