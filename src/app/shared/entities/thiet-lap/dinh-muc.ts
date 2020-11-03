export class DinhMuc {

    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public madinhmuc: string;
    public tendinhmuc: string;
    public danhmucgiacong_id: number;

    constructor(id: number = null, chinhanh_id: number = null, kichhoat: boolean = null, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, madinhmuc: string = null, tendinhmuc: string = null, danhmucgiacong_id: number = null) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.madinhmuc = madinhmuc;
        this.tendinhmuc = tendinhmuc;
        this.danhmucgiacong_id = danhmucgiacong_id;
    }
}