import { NhomKhachHang } from './../../entities/thiet-lap/nhom-khach-hang';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { not } from '@angular/compiler/src/output/output_ast';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { BaseService } from '..';

@Injectable({
  providedIn: 'root'
})
export class NhomKhachHangService extends BaseService {

  private apiUrl: string = environment.apiUrl + '/nhomkhachhang';
  
  constructor(private httpClient: HttpClient) { super(); }

  findNhomKhachHang(id: number): Observable<NhomKhachHang>{
    return this.httpClient.get<NhomKhachHang>(this.apiUrl + `/${id}`);
  }

  findNhomKhachHangs(kichhoat: boolean = true): Observable<NhomKhachHang[]>{
    let query_params: HttpParams = new HttpParams();
    query_params = query_params.set('kichhoat', kichhoat ? kichhoat.toString() : null);
    return this.httpClient.get<NhomKhachHang[]>(this.apiUrl, { params: query_params });
  }

  addNhomKhachHang(nhomkhachhang: NhomKhachHang): Observable<NhomKhachHang> {
    return this.httpClient.post<NhomKhachHang>(this.apiUrl, nhomkhachhang);
  }

  updateNhomKhachHang(nhomkhachhang: NhomKhachHang): Observable<NhomKhachHang>{
    return this.httpClient.put<NhomKhachHang>(this.apiUrl + `/${nhomkhachhang.id}`, nhomkhachhang);
  }

  deleteNhomKhachHang(id:number):Observable<NhomKhachHang>{
    return this.httpClient.delete<NhomKhachHang>(this.apiUrl + `/${id}`);
  }

  checkExistNhomkhachHang(manhomkhachhang: string, manhomkhachhang_old: string =null){
    if(manhomkhachhang == manhomkhachhang_old){
      return new Promise((resolve)=>{
        setTimeout( function(){
          resolve(true);
        }, 300);
      }); 
    }
    else{
      return this.httpClient.get(this.apiUrl + `/exist?manhomkhachhang=${manhomkhachhang}`)
      .toPromise()
      .then(res => !res)
      .catch(err => {
        console.error(err);
        this.handleError(err);
      });
    }
  }
}
