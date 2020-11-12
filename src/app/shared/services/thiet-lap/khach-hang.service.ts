import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KhachHang } from '@app/shared/entities';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '../base-service';

@Injectable({
  providedIn: 'root'
})
export class KhachHangService  extends BaseService {
  private apiUrl: string = environment.apiUrl + '/khachhang';
  
  constructor(private httpClient: HttpClient) {super(); }

  findKhachHang(id:number): Observable<KhachHang>{
    return this.httpClient.get<KhachHang>(this.apiUrl +`/${id}`);
  }

  findKhachHangs(): Observable<KhachHang[]>{
    return  this.httpClient.get<KhachHang[]>(this.apiUrl);
  }
  
  addKhachHang(khachhang: KhachHang): Observable<KhachHang>{
    return this.httpClient.post<KhachHang>(this.apiUrl , khachhang);
  }

  updateKhachHang(khachhang: KhachHang): Observable<KhachHang>{
    return this.httpClient.put<KhachHang>(this.apiUrl + `/${khachhang.id}`, khachhang);
  }

  deleteKhachHang(id: number): Observable<KhachHang>{
    return this.httpClient.delete<KhachHang>(this.apiUrl +`/${id}`);
  }

  checkExistKhachHang(makhachhang: string, makhachhang_old: string = null){
    if(makhachhang == makhachhang_old){
      return new Promise((resolve) => {
          setTimeout( function() {
          resolve(true); 
        }, 300);
    });
    }
    else{
      return this.httpClient.get(this.apiUrl + `/exist?makhachhang=${makhachhang}`)
      .toPromise()
      .then(res => !res )
      .catch(err =>{
        console.error(err);
        this.handleError(err);
      });
    }
  }

}
