import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ipv4 } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Ipv4Service extends BaseService {
    private apiUrl: string = environment.apiUrl + '/ipv4';

    constructor(private httpClient: HttpClient) {
        super();
    }

    ip(): Observable<any> {
        return this.httpClient.get<any>("http://ip-api.com/json/?fields=query");
    }

    viewOnline(): Observable<any[]> {
        return this.httpClient.get<any[]>(this.apiUrl + "/view-user-online");
    }
    
    updateOnline(ipv4: string): Observable<Ipv4> {
        return this.httpClient.put<Ipv4>(this.apiUrl + "/user-online", { ipv4: ipv4 });
    }

    findIpv4(id: number): Observable<Ipv4> {
        return this.httpClient.get<Ipv4>(this.apiUrl + `/${id}`);
    }

    findIpv4s(): Observable<Ipv4[]> {
        return this.httpClient.get<Ipv4[]>(this.apiUrl);
    }

    addIpv4(ipv4: Ipv4): Observable<Ipv4> {
        return this.httpClient.post<Ipv4>(this.apiUrl, ipv4);
    }

    updateIpv4(ipv4: Ipv4): Observable<Ipv4> {
        return this.httpClient.put<Ipv4>(this.apiUrl + `/${ipv4.id}`, ipv4);
    }

    deleteIpv4(id: number): Observable<Ipv4> {
        return this.httpClient.delete<Ipv4>(this.apiUrl + `/${id}`);
    }

    checkExistIpv4(maipv4: string, maipv4_old: string = null) {
        if (maipv4 == maipv4_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                });
            });
        else
            return this.httpClient
                .get(this.apiUrl + `/exist?maipv4=${maipv4}`)
                .toPromise()
                .then((res) => !res ) // false -> true (chưa tồn tại) và ngược lại
                .catch((err) => {
                    console.error(err);
                    this.handleError(err);
                });
    }
}
