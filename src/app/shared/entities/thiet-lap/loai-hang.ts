export class LoaiHang {

    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public maloaihang: string;
    public tenloaihang: string;

    constructor(id: number = null, chinhanh_id: number = null, kichhoat: boolean = null, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, maloaihang: string = null, tenloaihang: string = null) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.maloaihang = maloaihang;
        this.tenloaihang = tenloaihang;
    }
}