import { BaseService } from './../base-service';
import { DanhSachXe } from './../../entities/thiet-lap/danh-sach-xe';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment.prod';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DanhSachXeService extends BaseService {
    //request url khai bao trong evironment
    private apiUrl: string  = environment.apiUrl +'/soxe';

    constructor(private httpClient: HttpClient){super ();}

    findDanhSachXe (id:number) :Observable<DanhSachXe>{
        return this.httpClient.get<DanhSachXe>(this.apiUrl +`/${id}`);
    }
    findDanhSachXes(): Observable<DanhSachXe[]>{
        return this.httpClient.get<DanhSachXe[]>(this.apiUrl);
    }

    addDanhSachXe(danhsachxe: DanhSachXe): Observable<DanhSachXe>{
        return this.httpClient.post<DanhSachXe>(this.apiUrl,danhsachxe);
    }

 
    updateDanhSachXe(danhsachxe: DanhSachXe) :  Observable<DanhSachXe>{
        return this.httpClient.put<DanhSachXe>(this.apiUrl +`/${danhsachxe.id}`, danhsachxe);
    }

    deleteDanhSachXe(id: number): Observable<DanhSachXe>{
        return this.httpClient.delete<DanhSachXe>(this.apiUrl+`/${id}`);
    }

    checkDanhSachXeExist(danhsachxe: string, danhsachxe_old: string = null) {
        if (danhsachxe == danhsachxe_old)
            return new Promise((resolve) => {
                setTimeout(function () {
                    resolve(true); // chưa tồn tại
                }, 300);
            });
        else
            return this.httpClient.get(this.apiUrl + `/exist?soxe=${danhsachxe}`)
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
