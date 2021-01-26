export class PhieuXuatTraMuonHang {
    public phieuxuattramuonhang_chitiets: PhieuXuatTraMuonHang_ChiTiet[] = [];

    public matuphieu: string;
    public tenkhoxuat: string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

    public id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public ids: number;
    public sort: string;
    public ngayxuattramuonhang: Date;
    public maphieuxuattramuonhang: string;
    public chinhanh_id: number;
    public khoxuat_id: number;
    public phieunhapmuonhang_id: number;

    constructor(
        id: number = null,
        kichhoat: boolean = null,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        ids: number = null,
        sort: string = null,
        ngayxuattramuonhang: Date = new Date(),
        maphieuxuattramuonhang: string = null,
        chinhanh_id: number = null,
        khoxuat_id: number = null,
        phieunhapmuonhang_id: number = null
    ) {
        this.id = id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.ids = ids;
        this.sort = sort;
        this.ngayxuattramuonhang = ngayxuattramuonhang;
        this.maphieuxuattramuonhang = maphieuxuattramuonhang;
        this.chinhanh_id = chinhanh_id;
        this.khoxuat_id = khoxuat_id;
        this.phieunhapmuonhang_id = phieunhapmuonhang_id;
    }
}

export class PhieuXuatTraMuonHang_ChiTiet {
    /* liên kết vs khoá ngoại và thông tin thêm */
    public mahanghoa: string;
    public tenhanghoa: string;
    public trongluong: number;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public id: number;
    public phieuxuattramuonhang_id: number;
    public khoxuat_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public soluong: number;
    public chuthich: string;
    public soluongdatra: number;
    public trangthaitra: string;
    public phieunhapmuonhang_chitiet_id: number;

    constructor(
        id: number = null,
        phieuxuattramuonhang_id: number = null,
        khoxuat_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        soluong: number = 1,
        chuthich: string = null,
        soluongdatra: number = 0,
        trangthaitra: string = null,
        phieunhapmuonhang_chitiet_id: number = null
    ) {
        this.id = id;
        this.phieuxuattramuonhang_id = phieuxuattramuonhang_id;
        this.khoxuat_id = khoxuat_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.soluong = soluong;
        this.chuthich = chuthich;
        this.soluongdatra = soluongdatra;
        this.trangthaitra = trangthaitra;
        this.phieunhapmuonhang_chitiet_id = phieunhapmuonhang_chitiet_id;
    }
}
