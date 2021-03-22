export class BangGiaGiaCong {
    public banggiagiacong_chitiets: BangGiaGiaCong_ChiTiet[];
    public banggiagiacong_chitiets_old: BangGiaGiaCong_ChiTiet[];

    public tendonvigiacong: string;

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
    public ngayapdung: Date;
    public mabanggiacong: string;
    public donvigiacong_id: number;

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
        ngayapdung: Date = new Date(),
        mabanggiacong: string = null,
        donvigiacong_id: number = null,

        banggiagiacong_chitiets: BangGiaGiaCong_ChiTiet[] = [],
        banggiagiacong_chitiets_old: BangGiaGiaCong_ChiTiet[] = []
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
        this.ngayapdung = ngayapdung;
        this.mabanggiacong = mabanggiacong;
        this.donvigiacong_id = donvigiacong_id;

        this.banggiagiacong_chitiets = banggiagiacong_chitiets;
        this.banggiagiacong_chitiets_old = banggiagiacong_chitiets_old;
    }
}

export class BangGiaGiaCong_ChiTiet {
    public id: number;
    public bangiagiacong_id: number;
    public danhmucgiacong_id: number;
    public tieuchuan_id: number;
    public dongia: number;
    public chuthich: string;

    constructor(id: number = null, bangiagiacong_id: number = null, danhmucgiacong_id: number = null, tieuchuan_id: number = null, dongia: number = 0, chuthich: string = null) {
        this.id = id;
        this.bangiagiacong_id = bangiagiacong_id;
        this.danhmucgiacong_id = danhmucgiacong_id;
        this.tieuchuan_id = tieuchuan_id;
        this.dongia = dongia;
        this.chuthich = chuthich;
    }
}
