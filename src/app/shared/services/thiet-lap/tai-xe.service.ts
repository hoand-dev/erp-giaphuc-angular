import { TaiXe } from './../../entities/thiet-lap/tai-xe';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { BaseService } from '..';

@Injectable({
  providedIn: 'root'
})
export class TaiXeService extends BaseService{
  private apiUrl: string = environment.apiUrl + '/taixe';

  constructor(private httpClient: HttpClient) {super(); }

  findTaiXe(id:number): Observable<TaiXe> {
    return this.httpClient.get<TaiXe>(this.apiUrl +`/${id}`);
  }

  findTaiXes(): Observable<TaiXe[]>{
    return this.httpClient.get<TaiXe[]>(this.apiUrl);
  }

  addTaiXe(taixe:TaiXe): Observable<TaiXe>{

    return this.httpClient.post<TaiXe>(this.apiUrl, taixe);
  }

//   updateSoMat(somat: SoMat): Observable<SoMat> {
//     return this.httpClient.put<SoMat>(this.apiUrl + `/${somat.id}`, somat);
// }

  updateTaiXe(taixe:TaiXe): Observable<TaiXe>{
    return this.httpClient.put<TaiXe>(this.apiUrl + `/${taixe.id}`, taixe);
  }


  deleteTaiXe(id:number): Observable<TaiXe>{
    return this.httpClient.delete<TaiXe>(this.apiUrl + `/${id}`);
  }

  checkTaiXeExist(mataixe: string, mataixe_old: string = null) {
    if (mataixe == mataixe_old)
        return new Promise((resolve) => {
            setTimeout(function () {
                resolve(true); // chưa tồn tại
            }, 300);
        });
    else
        return this.httpClient.get(this.apiUrl + `/exist?mataixe=${mataixe}`)
            .toPromise()
            .then(
                res => !res
                ) // false -> true (chưa tồn tại) và ngược lại
            .catch(err => {
                console.error(err);
                this.handleError(err);
                return false; // tuong duong da ton tai
            });
  }

}
