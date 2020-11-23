export class PhieuNhapChuyenKho {
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
    public maphieunhapchuyenkho: string;
    public ngaynhapchuyenkho: Date;
    public khoxuatchuyen_id: number;
    public khonhap_id: number;

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
        maphieunhapchuyenkho: string = null,
        ngaynhapchuyenkho: Date = null,
        khoxuatchuyen_id: number = null,
        khonhap_id: number = null
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
        this.maphieunhapchuyenkho = maphieunhapchuyenkho;
        this.ngaynhapchuyenkho = ngaynhapchuyenkho;
        this.khoxuatchuyen_id = khoxuatchuyen_id;
        this.khonhap_id = khonhap_id;
    }
}

export class PhieuNhapChuyenKho_ChiTiet {
    public id: number;
    public phieunhapchuyenkho_id: number;
    public khonhan_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public quycachdai: number;
    public quycachrong: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;
    public phieuxuatchuyenkho_chitiet_id: number;

    constructor(
        id: number = null,
        phieunhapchuyenkho_id: number = null,
        khonhan_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = null,
        quycachdai: number = null,
        quycachrong: number = null,
        soluong: number = null,
        dongia: number = null,
        thanhtien: number = null,
        chuthich: string = null,
        phieuxuatchuyenkho_chitiet_id: number = null
    ) {
        this.id = id;
        this.phieunhapchuyenkho_id = phieunhapchuyenkho_id;
        this.khonhan_id = khonhan_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.quycachdai = quycachdai;
        this.quycachrong = quycachrong;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.phieuxuatchuyenkho_chitiet_id = phieuxuatchuyenkho_chitiet_id;
    }
}
