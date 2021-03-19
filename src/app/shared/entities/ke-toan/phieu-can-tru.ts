export class PhieuCanTru {
    public phieucantru_phieunhapkhos: PhieuCanTru_PhieuNhapKho[];
    public phieucantru_phieuxuatkhos: PhieuCanTru_PhieuXuatKho[];

    public phieucantru_phieunhapkhos_old: PhieuCanTru_PhieuNhapKho[];
    public phieucantru_phieuxuatkhos_old: PhieuCanTru_PhieuXuatKho[];

    public tenkhachhang: string;
    public kh_sodienthoai: string;
    public kh_diachi: string;
    public kh_nguoidaidien: string;
    public kh_chucvu: string;

    public makhachhang: string;
    public manhacungcap: string;
    public madonvigiacong: string;

    public sotien_bangchu: string;
    public phieuin_thoigian: string;
    public phieuin_nguoiin: string;
    public ngaylapphieu: string;

    public tennhacungcap: string;
    public ncc_sodienthoai: string;
    public ncc_diachi: string;
    public ncc_tennguoidaidien: string;

    public tendonvigiacong: string;
    public dvgc_sodienthoai: string;
    public dvgc_diachi: string;
    public noidungcantru: string;

    public nocu_khachhang: number = 0;
    public nocu_nhacungcap: number = 0;
    public nocu_donvigiacong: number = 0;
    public nocu_chenhlech: number = 0;

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
    public ngaycantru: Date;
    public maphieucantru: string;
    public loaicantru: string;
    public khachhang_id: number;
    public nhacungcap_id: number;
    public donvigiacong_id: number;
    public sotiencantru: number;
    public noidungcantru_id: number;

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
        ngaycantru: Date = new Date(),
        maphieucantru: string = null,
        loaicantru: string = null,
        khachhang_id: number = null,
        nhacungcap_id: number = null,
        donvigiacong_id: number = null,
        sotiencantru: number = 0,
        noidungcantru_id: number = null,

        phieucantru_phieunhapkhos: PhieuCanTru_PhieuNhapKho[] = [],
        phieucantru_phieuxuatkhos: PhieuCanTru_PhieuXuatKho[] = [],
        phieucantru_phieunhapkhos_old: PhieuCanTru_PhieuNhapKho[] = [],
        phieucantru_phieuxuatkhos_old: PhieuCanTru_PhieuXuatKho[] = []
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
        this.ngaycantru = ngaycantru;
        this.maphieucantru = maphieucantru;
        this.loaicantru = loaicantru;
        this.khachhang_id = khachhang_id;
        this.nhacungcap_id = nhacungcap_id;
        this.donvigiacong_id = donvigiacong_id;
        this.sotiencantru = sotiencantru;
        this.noidungcantru_id = noidungcantru_id;

        this.phieucantru_phieunhapkhos = phieucantru_phieunhapkhos;
        this.phieucantru_phieuxuatkhos = phieucantru_phieuxuatkhos;
        this.phieucantru_phieunhapkhos_old = phieucantru_phieunhapkhos_old;
        this.phieucantru_phieuxuatkhos_old = phieucantru_phieuxuatkhos_old;
    }
}

export class PhieuCanTru_PhieuNhapKho {
    public ngaynhapkho: Date;
    public maphieunhapkho: string;
    public tongthanhtien: number;
    public sotienchitruoc: number;
    public sotienconlai: number;

    public id: number;
    public phieucantru_id: number;
    public phieunhapkho_id: number;
    public loaiphieunhapkho: string;
    public sotienchi: number;
    public chuthich: string;

    constructor(id: number = null, phieucantru_id: number = null, phieunhapkho_id: number = null, loaiphieunhapkho: string = null, sotienchi: number = 0, chuthich: string = null) {
        this.id = id;
        this.phieucantru_id = phieucantru_id;
        this.phieunhapkho_id = phieunhapkho_id;
        this.loaiphieunhapkho = loaiphieunhapkho;
        this.sotienchi = sotienchi;
        this.chuthich = chuthich;
    }
}

export class PhieuCanTru_PhieuXuatKho {
    public ngayxuatkho: Date;
    public maphieuxuatkho: string;
    public tongthanhtien: number;
    public sotienthutruoc: number;
    public sotienconlai: number;

    public id: number;
    public phieucantru_id: number;
    public phieuxuatkho_id: number;
    public loaiphieuxuatkho: string;
    public sotienthu: number;
    public chuthich: string;

    constructor(id: number = null, phieucantru_id: number = null, phieuxuatkho_id: number = null, loaiphieuxuatkho: string = null, sotienthu: number = 0, chuthich: string = null) {
        this.id = id;
        this.phieucantru_id = phieucantru_id;
        this.phieuxuatkho_id = phieuxuatkho_id;
        this.loaiphieuxuatkho = loaiphieuxuatkho;
        this.sotienthu = sotienthu;
        this.chuthich = chuthich;
    }
}
