export class PhieuDieuChinhKho {
    public id: number;
    public chinhanh_id: number;
    public kickhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public ids: number;
    public sort: string;
    public maphieudieuchinhkho: string;
    public ngaydieuchinhkho: Date;
    public khodieuchinh_id: number;

    public phieudieuchinhkho_chitiets: PhieuDieuChinhKho_ChiTiet[];

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

    public tenkhodieuchinh: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kickhoat: boolean = null,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        ids: number = null,
        sort: string = null,
        maphieudieuchinhkho: string = null,
        ngaydieuchinhkho: Date = new Date(),
        khodieuchinh_id: number = null,

        phieudieuchinhkho_chitiets: PhieuDieuChinhKho_ChiTiet[] = []
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kickhoat = kickhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.ids = ids;
        this.sort = sort;
        this.maphieudieuchinhkho = maphieudieuchinhkho;
        this.ngaydieuchinhkho = ngaydieuchinhkho;
        this.khodieuchinh_id = khodieuchinh_id;

        this.phieudieuchinhkho_chitiets = phieudieuchinhkho_chitiets;
    }
}

export class PhieuDieuChinhKho_ChiTiet {
    public id: number;
    public phieudieuchinhkho_id: number;
    public khodieuchinh_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;

    public mahanghoa: string;
    public tenhanghoa: string;
    public trongluong: number;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    constructor(
        id: number = null,
        phieudieuchinhkho_id: number = null,
        khodieuchinh_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        soluong: number = 0,
        dongia: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        trongluong: number = 0
    ) {
        this.id = id;
        this.phieudieuchinhkho_id = phieudieuchinhkho_id;
        this.khodieuchinh_id = khodieuchinh_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.trongluong = trongluong;
    }
}
