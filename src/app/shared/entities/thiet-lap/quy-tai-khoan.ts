export class QuyTaiKhoan {
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
    public maquy: string;
    public tenquy: string;
    public tienquybandau: number;
    public tencongty: string;
    public dienthoai: string;
    public fax: string;
    public masothue: string;
    public diachi: string;
    public nguoidaidien: string;
    public chucvu: string;
    public sotaikhoan: string;
    public tainganhang: string;
    public sotaikhoan2: string;
    public tainganhang2: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        maquy: string = null,
        tenquy: string = null,
        tienquybandau: number = 0,
        tencongty: string = null,
        dienthoai: string = null,
        fax: string = null,
        masothue: string = null,
        diachi: string = null,
        nguoidaidien: string = null,
        chucvu: string = null,
        sotaikhoan: string = null,
        tainganhang: string = null,
        sotaikhoan2: string = null,
        tainganhang2: string = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.maquy = maquy;
        this.tenquy = tenquy;
        this.tienquybandau = tienquybandau;
        this.tencongty = tencongty;
        this.dienthoai = dienthoai;
        this.fax = fax;
        this.masothue = masothue;
        this.diachi = diachi;
        this.nguoidaidien = nguoidaidien;
        this.chucvu = chucvu;
        this.sotaikhoan = sotaikhoan;
        this.tainganhang = tainganhang;
        this.sotaikhoan2 = sotaikhoan2;
        this.tainganhang2 = tainganhang2;
    }
}
