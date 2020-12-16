export class KhoHang {
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
    public makhohang: string;
    public tenkhohang: string;
    public khobe: boolean;
    public dienthoai: string;
    public diachi: string;
    public khuvuc_id: number;

    public tenkhuvuc: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        makhohang: string = null,
        tenkhohang: string = null,
        khobe: boolean = false,
        dienthoai: string = null,
        diachi: string = null,
        khuvuc_id: number = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.makhohang = makhohang;
        this.tenkhohang = tenkhohang;
        this.khobe = khobe;
        this.dienthoai = dienthoai;
        this.diachi = diachi;
        this.khuvuc_id = khuvuc_id;
    }
}
