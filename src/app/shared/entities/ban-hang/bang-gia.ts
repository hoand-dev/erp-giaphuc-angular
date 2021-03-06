export class BangGia {
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
    public ngaybanggia: Date;
    public ngaycohieuluc: Date;
    public mabanggia: string;
    public khachhang_id: number;
    public noidungno_id: number;
    public thoigiangiao: string;
    public diadiemgiao: string;

    public banggia_chitiet: BangGia_ChiTiet[];

    public tenkhachhang: string;
    public diachi: string;
    public sodienthoai: string;
    public dkthanhtoan: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        ids: number = null,
        sort: string = null,
        ngaybanggia: Date = new Date(),
        ngaycohieuluc: Date = new Date(),
        mabanggia: string = null,
        khachhang_id: number = null,
        noidungno_id: number = null,
        thoigiangiao: string = null,
        diadiemgiao: string = null,
        tenkhachhang: string = null,
        diachi: string = null,
        sodienthoai: string = null,
        hoten: string = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.ids = ids;
        this.sort = sort;
        this.ngaybanggia = ngaybanggia;
        this.ngaycohieuluc = ngaycohieuluc;
        this.mabanggia = mabanggia;
        this.khachhang_id = khachhang_id;
        this.noidungno_id = noidungno_id;
        this.thoigiangiao = thoigiangiao;
        this.diadiemgiao = diadiemgiao;
        this.tenkhachhang = tenkhachhang;
        this.diachi = diachi;
        this.sodienthoai = sodienthoai;
    }
}

export class BangGia_ChiTiet {
    public id: number;
    public banggia_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public dongia: number;
    public dongiacothue: number;
    public chuthich: string;
    public tenhanghoa_inphieu: string;

    public trongluong: number = 0;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    constructor(
        id: number = null,
        banggia_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        tilequydoiphu: number = 1,
        dongia: number = 0,
        dongiacothue: number = 0,
        chuthich: string = null,
        tenhanghoa_inphieu: string = null,
        trongluong: number = 0
    ) {
        this.id = id;
        this.banggia_id = banggia_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.tilequydoiphu = tilequydoiphu;
        this.dongia = dongia;
        this.dongiacothue = dongiacothue;
        this.chuthich = chuthich;
        this.tenhanghoa_inphieu = tenhanghoa_inphieu;
        this.trongluong = trongluong;
    }
}
