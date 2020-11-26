export class PhieuKiemKho {
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
    public maphieukiemkho: string;
    public tungay: Date;
    public denngay: Date;
    public nhanvienkiemkho: string;
    public khokiem_id: number;
    public nhomhanghoa: string;
    public dvt_id: number;
    public khobe_id: number;
    public tinhtrang: string;
    public ngayhoanthanh: Date;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = null,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        ids: number = null,
        sort: string = null,
        maphieukiemkho: string = null,
        tungay: Date = null,
        denngay: Date = null,
        nhanvienkiemkho: string = null,
        khokiem_id: number = null,
        nhomhanghoa: string = null,
        dvt_id: number = null,
        khobe_id: number = null,
        tinhtrang: string = null,
        ngayhoanthanh: Date = null
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
        this.maphieukiemkho = maphieukiemkho;
        this.tungay = tungay;
        this.denngay = denngay;
        this.nhanvienkiemkho = nhanvienkiemkho;
        this.khokiem_id = khokiem_id;
        this.nhomhanghoa = nhomhanghoa;
        this.dvt_id = dvt_id;
        this.khobe_id = khobe_id;
        this.tinhtrang = tinhtrang;
        this.ngayhoanthanh = ngayhoanthanh;
    }
}

export class PhieuKiemKho_ChiTiet {
    public id: number;
    public phieukiemkho_id: number;
    public khokiem_id: number;
    public khobe_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public sodudauky: number;
    public tongnhap: number;
    public tongxuat: number;
    public soducuoikytrenso: number;
    public thuctekiemkho: number;
    public hangbe: number;
    public chenhlech: number;
    public dongia: number;
    public thanhtien: number;
    public hangbeluckiem: number;

    constructor(
        id: number = null,
        phieukiemkho_id: number = null,
        khokiem_id: number = null,
        khobe_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        sodudauky: number = null,
        tongnhap: number = null,
        tongxuat: number = null,
        soducuoikytrenso: number = null,
        thuctekiemkho: number = null,
        hangbe: number = null,
        chenhlech: number = null,
        dongia: number = null,
        thanhtien: number = null,
        hangbeluckiem: number = null
    ) {
        this.id = id;
        this.phieukiemkho_id = phieukiemkho_id;
        this.khokiem_id = khokiem_id;
        this.khobe_id = khobe_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.sodudauky = sodudauky;
        this.tongnhap = tongnhap;
        this.tongxuat = tongxuat;
        this.soducuoikytrenso = soducuoikytrenso;
        this.thuctekiemkho = thuctekiemkho;
        this.hangbe = hangbe;
        this.chenhlech = chenhlech;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.hangbeluckiem = hangbeluckiem;
    }
}
