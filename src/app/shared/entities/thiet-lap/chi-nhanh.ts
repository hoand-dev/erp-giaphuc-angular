export class ChiNhanh {

    public id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public machinhanh: string;
    public tenchinhanh: string;
    public diachi: string;
    public email: string;
    public dienthoai: string;
    public mamau: string;
    public chinhanh_trungtam: boolean;

    constructor(id: number = null, kichhoat: boolean = true, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, machinhanh: string = null, tenchinhanh: string = null, diachi: string = null, email: string = null, dienthoai: string = null, mamau: string = null, chinhanh_trungtam: boolean = false) {
        this.id = id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.machinhanh = machinhanh;
        this.tenchinhanh = tenchinhanh;
        this.diachi = diachi;
        this.email = email;
        this.dienthoai = dienthoai;
        this.mamau = mamau;
        this.chinhanh_trungtam = chinhanh_trungtam;
    }
}
