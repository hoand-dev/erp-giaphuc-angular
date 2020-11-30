export class PhieuXuatChuyenKho {
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
    public maphieuxuatchuyenkho: string;
    public ngayxuatchuyenkho: Date;
    public khoxuatchuyen_id: number;
    public khonhap_id: number;
    public trangthainhap: string;

    public phieuxuatchuyenkho_chitiets:  PhieuXuatChuyenKho_ChiTiet[];

    public tenkhoxuatchuyen: string;
    public tenkhonhap: string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

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
        maphieuxuatchuyenkho: string = null,
        ngayxuatchuyenkho: Date = new Date(),
        khoxuatchuyen_id: number = null,
        khonhap_id: number = null,
        trangthainhap: string = null,
        phieuxuatchuyenkho_chitiets: PhieuXuatChuyenKho_ChiTiet[] = []
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
        this.maphieuxuatchuyenkho = maphieuxuatchuyenkho;
        this.ngayxuatchuyenkho = ngayxuatchuyenkho;
        this.khoxuatchuyen_id = khoxuatchuyen_id;
        this.khonhap_id = khonhap_id;
        this.trangthainhap = trangthainhap;

        this.phieuxuatchuyenkho_chitiets = phieuxuatchuyenkho_chitiets;
    }
}

export class PhieuXuatChuyenKho_ChiTiet {
    public id: number;
    public phieuxuatchuyenkho_id: number;
    public khoxuatchuyen_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;
    public soluongdanhap: number;
    public trangthainhap: string;

    public mahanghoa: string;
    public tenhanghoa: string;
    public tendonvitinh: string;

    constructor(
        id: number = null,
        phieuxuatchuyenkho_id: number = null,
        khoxuatchuyen_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        soluong: number = 0,
        dongia: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        soluongdanhap: number = 0,
        trangthainhap: string = null
    ) {
        this.id = id;
        this.phieuxuatchuyenkho_id = phieuxuatchuyenkho_id;
        this.khoxuatchuyen_id = khoxuatchuyen_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.soluongdanhap = soluongdanhap;
        this.trangthainhap = trangthainhap;
    }
}
