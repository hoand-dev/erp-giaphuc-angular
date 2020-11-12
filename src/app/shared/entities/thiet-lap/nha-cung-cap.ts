export class NhaCungCap {

    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public manhacungcap: string;
    public tennhacungcap: string;
    public sodienthoai: string;
    public diachi: string;
    public masothue: string;
    public email: string;
    public tennguoidaidien: string;
    public sotaikhoan: string;
    public tenchutaikhoan: string;
    public congnobandau: number;
    public tennganhang: string;
    public nhomnhacungcap_id: number;
    public dachicongno: number;

    constructor(id: number = null, chinhanh_id: number = null, kichhoat: boolean = true, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, manhacungcap: string = null, tennhacungcap: string = null, sodienthoai: string = null, diachi: string = null, masothue: string = null, email: string = null, tennguoidaidien: string = null, sotaikhoan: string = null, tenchutaikhoan: string = null, congnobandau: number = null, tennganhang: string = null, nhomnhacungcap_id: number = null, dachicongno: number = null){
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.manhacungcap = manhacungcap;
        this.tennhacungcap = tennhacungcap;
        this.sodienthoai = sodienthoai;
        this.diachi = diachi;
        this.masothue = masothue;
        this.email = email;
        this.tennguoidaidien = tennguoidaidien;
        this.sotaikhoan = sotaikhoan;
        this.tenchutaikhoan = tenchutaikhoan;
        this.congnobandau = congnobandau;
        this.tennganhang = tennganhang;
        this.nhomnhacungcap_id = nhomnhacungcap_id;
        this.dachicongno = dachicongno;
    }
}