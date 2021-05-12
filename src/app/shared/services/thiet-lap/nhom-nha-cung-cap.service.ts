import { Observable } from 'rxjs';
import { NhomNhaCungCap } from './../../entities/thiet-lap/nhom-nha-cung-cap';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { BaseService } from '..';

@Injectable({
  providedIn: 'root'
})
export class NhomNhaCungCapService extends BaseService {
  
  private apiUrl: string = environment.apiUrl + '/nhomnhacungcap';

  constructor (private httpClient: HttpClient){super();}

  findNhomNhaCungCap(id: number): Observable<NhomNhaCungCap> {
    return  this.httpClient.get<NhomNhaCungCap>(this.apiUrl + `/${id}`);
  }

  findNhomNhaCungCaps(kichhoat: boolean = true): Observable<NhomNhaCungCap[]>{
    let query_params: HttpParams = new HttpParams();
    query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
    return this.httpClient.get<NhomNhaCungCap[]>(this.apiUrl, { params: query_params })
  }

  addNhomNhaCungCap(nhomnhacungcap: NhomNhaCungCap): Observable<NhomNhaCungCap>{
    return this.httpClient.post<NhomNhaCungCap>(this.apiUrl ,nhomnhacungcap);
  }

  updateNhomNhaCungCap(nhomnhacungcap: NhomNhaCungCap): Observable<NhomNhaCungCap>{
    return this.httpClient.put<NhomNhaCungCap>(this.apiUrl  + `/${nhomnhacungcap.id}`, nhomnhacungcap);
  }

  deleteNhomNhaCungCap(id: number): Observable<NhomNhaCungCap>{
    return this.httpClient.delete<NhomNhaCungCap>(this.apiUrl + `/${id}`);
  }

  checkExistNhomNhaCungCap(manhomnhacungcap: string, manhomnhacungcap_old: string  =null){
    if(manhomnhacungcap == manhomnhacungcap_old){
      return new Promise((resolve) => {
        setTimeout(function() {
          resolve(true);
        }, 300);
      });
    }
    else{
      return this.httpClient.get(this.apiUrl + `/exist?manhomnhacungcap=${manhomnhacungcap}`)
      .toPromise()
      .then(res => !res)
      .catch(err =>{
        console.error(err);
        this.handleError(err);
      });
    }
  }

}
