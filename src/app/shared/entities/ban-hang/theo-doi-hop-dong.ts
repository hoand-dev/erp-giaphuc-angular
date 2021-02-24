export class TheoDoiHopDong {
    public tennhanviensale: string;
    public loaihopdong: string;

    public makhachhang: string;

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
    public masohopdong: string;
    public khachhang_id: number;
    public noidungthanhtoan: string;
    public thoigiancongno: number;
    public ngayky: Date;
    public ngayhethan: Date;
    public thoigianconlai: number;
    public nguoikybena: string;
    public nguoikybenb: string;
    public thongtinlienhe: string;
    public user_id: number;
    public nhomkhachhang_id: number;
    public ids: number;
    public sort: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        masohopdong: string = null,
        khachhang_id: number = null,
        noidungthanhtoan: string = null,
        thoigiancongno: number = null,
        ngayky: Date = null,
        ngayhethan: Date = null,
        thoigianconlai: number = null,
        nguoikybena: string = null,
        nguoikybenb: string = null,
        thongtinlienhe: string = null,
        user_id: number = null,
        nhomkhachhang_id: number = null,
        ids: number = null,
        sort: string = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.masohopdong = masohopdong;
        this.khachhang_id = khachhang_id;
        this.noidungthanhtoan = noidungthanhtoan;
        this.thoigiancongno = thoigiancongno;
        this.ngayky = ngayky;
        this.ngayhethan = ngayhethan;
        this.thoigianconlai = thoigianconlai;
        this.nguoikybena = nguoikybena;
        this.nguoikybenb = nguoikybenb;
        this.thongtinlienhe = thongtinlienhe;
        this.user_id = user_id;
        this.nhomkhachhang_id = nhomkhachhang_id;
        this.ids = ids;
        this.sort = sort;
    }
}
