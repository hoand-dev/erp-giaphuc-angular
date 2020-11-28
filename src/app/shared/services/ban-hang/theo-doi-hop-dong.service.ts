import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TheoDoiHopDong } from '@app/shared/entities';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TheoDoiHopDongService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/theodoihopdong';
  
    constructor(private httpClient: HttpClient) {super(); }
  
    findHopDong(id:number): Observable<TheoDoiHopDong>{
      return this.httpClient.get<TheoDoiHopDong>(this.apiUrl +`/${id}`);
    }
  
    findtheodoihopdongs(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<TheoDoiHopDong[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<TheoDoiHopDong[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }
    
    addHopDong(hopdong: TheoDoiHopDong): Observable<TheoDoiHopDong>{
      return this.httpClient.post<TheoDoiHopDong>(this.apiUrl , hopdong);
    }
  
    updateHopDong(hopdong: TheoDoiHopDong): Observable<TheoDoiHopDong>{
      return this.httpClient.put<TheoDoiHopDong>(this.apiUrl + `/${hopdong.id}`, hopdong);
    }
  
    deleteHopDong(id: number): Observable<TheoDoiHopDong>{
      return this.httpClient.delete<TheoDoiHopDong>(this.apiUrl +`/${id}`);
    }
  
    checkExistHopDong(masohopdong: string, masohopdong_old: string = null){
      if(masohopdong == masohopdong_old){
        return new Promise((resolve) => {
            setTimeout( function() {
            resolve(true); 
          }, 300);
      });
      }
      else{
        return this.httpClient.get(this.apiUrl + `/exist?masohopdong=${masohopdong}`)
        .toPromise()
        .then(res => !res )
        .catch(err =>{
          console.error(err);
          this.handleError(err);
        });
      }
    }
}
