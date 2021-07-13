import { BaseService } from '@app/shared/services';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BangGiaMel, BangGiaMel_ChiTiet } from '@app/shared/entities';

import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class BangGiaMelService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/banggiamel';

    constructor(private httpClient: HttpClient) {
        super();
    }

    findBangGiaMel(id: number): Observable<BangGiaMel> {
        return this.httpClient.get<BangGiaMel>(this.apiUrl + `/${id}`);
    }

    findBangGiaMels(chinhanh_id: number = null, fromDay: Date, toDay: Date): Observable<BangGiaMel[]> {
        let query_chinhanh = chinhanh_id == null ? '?' : '?chinhanh_id=' + chinhanh_id + '&';
        let tungay = moment(fromDay).format('YYYY-MM-DD HH:mm:ss');
        let denngay = moment(toDay).format('YYYY-MM-DD HH:mm:ss');
        return this.httpClient.get<BangGiaMel[]>(this.apiUrl + query_chinhanh + `tungay=${tungay}&denngay=${denngay}`);
    }

    addBangGiaMel(banggiamel: BangGiaMel): Observable<BangGiaMel> {
        return this.httpClient.post<BangGiaMel>(this.apiUrl, banggiamel);
    }

    updateBangGiaMel(banggiamel: BangGiaMel): Observable<BangGiaMel> {
        return this.httpClient.put<BangGiaMel>(this.apiUrl + `/${banggiamel.id}`, banggiamel);
    }

    // https://stackoverflow.com/questions/32423348/angular-post-uploaded-file
    uploadExcel(files: File[]): Observable<BangGiaMel_ChiTiet[]> {
        let formData: FormData = new FormData();
        formData.append('files', files[0], files[0].name);
        // For multiple files
        // for (let i = 0; i < files.length; i++) {
        //     formData.append(`files[]`, files[i], files[i].name);
        // }

        return this.httpClient.post<BangGiaMel_ChiTiet[]>(this.apiUrl + `/upload-excel`, formData);
    }

    deleteBangGiaMel(id: number): Observable<BangGiaMel> {
        return this.httpClient.delete<BangGiaMel>(this.apiUrl + `/${id}`);
    }
}
