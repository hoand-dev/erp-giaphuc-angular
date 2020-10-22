import { PhieuCapPhatVatTuChiTiet } from "./phieu-cap-phat-vat-tu-chi-tiet";

export class PhieuCapPhatVatTu {
    
    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public ids: number;
    public sort: string;
    public loaiphieuxuat: string;
    public ngayxuatkho: Date;
    public maphieuxuatkho: string;
    public khoxuat_id: number;
    public trangthaiphieu: string;

    public PhieuCapPhatVatTuChiTiets: PhieuCapPhatVatTuChiTiet[];
}