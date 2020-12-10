export class PhieuThu {
    public phieuthu_phieuxuatkhos: PhieuThu_PhieuXuatKho[];
    public phieuthu_phieuxuatkhos_old: PhieuThu_PhieuXuatKho[];

    public nocu: number;
    public tongthu: number;
    public conno: number;

    public tenquythu: string;
    public tennoidungthu: string;

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
    public ngaythu: Date;
    public maphieuthu: string;
    public chungtu: string;
    public loaiphieuthu: string;
    public khachhang_id: number;
    public nhacungcap_id: number;
    public quythu_id: number;
    public noidungthuchi_id: number;
    public sotienthu: number;
    public sotienthu_vat: number;
    public sotienthu_khongvat: number;
    public sotiengiam: number;
    public sotiengiam_vat: number;
    public sotiengiam_khongvat: number;
    public sotienthu_du: number;
    public sotienthu_duvat: number;
    public sotienthu_dukhongvat: number;
    public sotienthu_congnobandau: number;
    public sotienchi_dagiam: number;
    public nguoinop_hoten: string;
    public nguoinop_diachi: string;
    public nguoinop_dienthoai: string;

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
        ngaythu: Date = new Date,
        maphieuthu: string = null,
        chungtu: string = null,
        loaiphieuthu: string = null,
        khachhang_id: number = null,
        nhacungcap_id: number = null,
        quythu_id: number = null,
        noidungthuchi_id: number = null,
        sotienthu: number = 0,
        sotienthu_vat: number = 0,
        sotienthu_khongvat: number = 0,
        sotiengiam: number = 0,
        sotiengiam_vat: number = 0,
        sotiengiam_khongvat: number = 0,
        sotienthu_du: number = 0,
        sotienthu_duvat: number = 0,
        sotienthu_dukhongvat: number = 0,
        sotienthu_congnobandau: number = 0,
        sotienchi_dagiam: number = 0,

        nocu: number = 0,
        tongthu: number = 0,
        conno: number = 0,

        phieuthu_phieuxuatkhos: PhieuThu_PhieuXuatKho[] = [],
        phieuthu_phieuxuatkhos_old: PhieuThu_PhieuXuatKho[] = []
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
        this.ngaythu = ngaythu;
        this.maphieuthu = maphieuthu;
        this.chungtu = chungtu;
        this.loaiphieuthu = loaiphieuthu;
        this.khachhang_id = khachhang_id;
        this.nhacungcap_id = nhacungcap_id;
        this.quythu_id = quythu_id;
        this.noidungthuchi_id = noidungthuchi_id;
        this.sotienthu = sotienthu;
        this.sotienthu_vat = sotienthu_vat;
        this.sotienthu_khongvat = sotienthu_khongvat;
        this.sotiengiam = sotiengiam;
        this.sotiengiam_vat = sotiengiam_vat;
        this.sotiengiam_khongvat = sotiengiam_khongvat;
        this.sotienthu_du = sotienthu_du;
        this.sotienthu_duvat = sotienthu_duvat;
        this.sotienthu_dukhongvat = sotienthu_dukhongvat;
        this.sotienthu_congnobandau = sotienthu_congnobandau;
        this.sotienchi_dagiam = sotienchi_dagiam;

        this.nocu = nocu;
        this.tongthu = tongthu;
        this.conno = conno;

        this.phieuthu_phieuxuatkhos = phieuthu_phieuxuatkhos;
        this.phieuthu_phieuxuatkhos_old = phieuthu_phieuxuatkhos_old;
    }
}

export class PhieuThu_PhieuXuatKho {
    public id: number;
    public phieuthu_id: number;
    public phieuxuatkho_id: number;
    public loaiphieuxuatkho: string;
    public sotienthu: number;
    public sotienthu_vat: number;
    public sotienthu_khongvat: number;
    public sotiengiam: number;
    public sotiengiam_vat: number;
    public sotiengiam_khongvat: number;
    public sotienthu_dagiam: number;
    public chuthich: string;

    public ngayxuatkho: Date;
    public maphieuxuatkho: string;
    public cothuevat: boolean;
    public thuevat: number;
    public tongthanhtien: number;
    public sotienthutruoc: number;

    constructor(
        id: number = null,
        phieuthu_id: number = null,
        phieuxuatkho_id: number = null,
        loaiphieuxuatkho: string = null,
        sotienthu: number = 0,
        sotienthu_vat: number = 0,
        sotienthu_khongvat: number = 0,
        sotiengiam: number = 0,
        sotiengiam_vat: number = 0,
        sotiengiam_khongvat: number = 0,
        sotienthu_dagiam: number = 0,
        chuthich: string = null
    ) {
        this.id = id;
        this.phieuthu_id = phieuthu_id;
        this.phieuxuatkho_id = phieuxuatkho_id;
        this.loaiphieuxuatkho = loaiphieuxuatkho;
        this.sotienthu = sotienthu;
        this.sotienthu_vat = sotienthu_vat;
        this.sotienthu_khongvat = sotienthu_khongvat;
        this.sotiengiam = sotiengiam;
        this.sotiengiam_vat = sotiengiam_vat;
        this.sotiengiam_khongvat = sotiengiam_khongvat;
        this.sotienthu_dagiam = sotienthu_dagiam;
        this.chuthich = chuthich;
    }
}
