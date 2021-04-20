import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import moment from 'moment';
import { Observable } from 'rxjs';
import { BaseService } from '@app/shared/services';
import {
    LichSu,
    PhieuDieuChinhKho,
    PhieuNhapChuyenKho,
    PhieuNhapKho,
    PhieuNhapMuonHang,
    PhieuNhapTraMuonHang,
    PhieuXuatChuyenKho,
    PhieuXuatKho,
    PhieuXuatMuonHang,
    PhieuXuatTraMuonHang
} from '@app/shared/entities';

@Injectable({
    providedIn: 'root'
})
export class LichSuService extends BaseService {
    private apiUrl: string = environment.apiUrl + '/he-thong';

    constructor(private httpClient: HttpClient) {
        super();
    }

    finds(fromDay: Date, toDay: Date, chinhanh_id: number = null): Observable<LichSu[]> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('tungay', moment(fromDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('denngay', moment(toDay).format('YYYY-MM-DD HH:mm:ss'));
        query_params = query_params.set('chinhanh_id', chinhanh_id ? chinhanh_id.toString() : null);

        return this.httpClient.get<LichSu[]>(this.apiUrl + '/lich-su', { params: query_params });
    }

    findNhapKho(master_id: number): Observable<PhieuNhapKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuNhapKho>(this.apiUrl + '/lich-su-nhap-kho', { params: query_params });
    }

    findXuatKho(master_id: number): Observable<PhieuXuatKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuXuatKho>(this.apiUrl + '/lich-su-xuat-kho', { params: query_params });
    }

    findDieuChinhKho(master_id: number): Observable<PhieuDieuChinhKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuDieuChinhKho>(this.apiUrl + '/lich-su-dieu-chinh-kho', { params: query_params });
    }

    findXuatChuyenKho(master_id: number): Observable<PhieuXuatChuyenKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuXuatChuyenKho>(this.apiUrl + '/lich-su-xuat-chuyen-kho', { params: query_params });
    }

    findNhapChuyenKho(master_id: number): Observable<PhieuNhapChuyenKho> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuNhapChuyenKho>(this.apiUrl + '/lich-su-nhap-chuyen-kho', { params: query_params });
    }

    findXuatMuonHang(master_id: number): Observable<PhieuXuatMuonHang> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuXuatMuonHang>(this.apiUrl + '/lich-su-xuat-muon-hang', { params: query_params });
    }

    findNhapMuonHang(master_id: number): Observable<PhieuNhapMuonHang> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuNhapMuonHang>(this.apiUrl + '/lich-su-nhap-muon-hang', { params: query_params });
    }

    findXuatTraMuonHang(master_id: number): Observable<PhieuXuatTraMuonHang> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuXuatTraMuonHang>(this.apiUrl + '/lich-su-xuat-tra-muon-hang', { params: query_params });
    }

    findNhapTraMuonHang(master_id: number): Observable<PhieuNhapTraMuonHang> {
        let query_params: HttpParams = new HttpParams();
        query_params = query_params.set('master_id', master_id.toString());
        return this.httpClient.get<PhieuNhapTraMuonHang>(this.apiUrl + '/lich-su-nhap-tra-muon-hang', { params: query_params });
    }
}
