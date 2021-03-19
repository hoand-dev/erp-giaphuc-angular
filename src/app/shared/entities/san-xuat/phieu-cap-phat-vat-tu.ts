export class PhieuCapPhatVatTu {
    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

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

export class PhieuCapPhatVatTuChiTiet {
    public id: number;
    public phieuxuatkho_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public soluong: number;
    public dinhmuc_quydoi: number;
    public chuthich: string;

    public tongtrongluong: number = 0;
    public tongkien: number = 0;
    public tongm3: number = 0;
    public m3: number = 0;
    public soluongconlai: number = 0;
}
