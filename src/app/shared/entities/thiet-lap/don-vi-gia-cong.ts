import { KhoHang } from './kho-hang';

export class DonViGiaCong {
    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public madonvigiacong: string;
    public tendonvigiacong: string;
    public sodienthoai: string;
    public diachi: string;
    public masothue: string;
    public tennganhang: string;
    public sotaikhoan: string;
    public tenchutaikhoan: string;
    public khogiacong_id: number;
    public loaigiacong: number;
    public congnobandau: number;

    public loaidonvi: boolean;
    public khogiacong_tenkho: string = null;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        madonvigiacong: string = null,
        tendonvigiacong: string = null,
        sodienthoai: string = null,
        diachi: string = null,
        masothue: string = null,
        tennganhang: string = null,
        sotaikhoan: string = null,
        tenchutaikhoan: string = null,
        khogiacong_id: number = null,
        loaigiacong: number = null,
        congnobandau: number = 0,
        loaidonvi: boolean = false
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.madonvigiacong = madonvigiacong;
        this.tendonvigiacong = tendonvigiacong;
        this.sodienthoai = sodienthoai;
        this.diachi = diachi;
        this.masothue = masothue;
        this.tennganhang = tennganhang;
        this.sotaikhoan = sotaikhoan;
        this.tenchutaikhoan = tenchutaikhoan;
        this.khogiacong_id = khogiacong_id;
        this.loaigiacong = loaigiacong;
        this.congnobandau = congnobandau;

        this.loaidonvi = loaidonvi;
    }
}
