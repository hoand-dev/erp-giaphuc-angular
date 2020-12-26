export class PhieuChi {
    public phieuchi_phieunhapkhos: PhieuChi_PhieuNhapKho[];
    public phieuchi_phieunhapkhos_old: PhieuChi_PhieuNhapKho[];

    public nocu: number;
    public tongchi: number;
    public conno: number;

    public tenquychi: string;
    public tennoidungchi: string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;
    public malenhvay: string;

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
    public ngaychi: Date;
    public maphieuchi: string;
    public loaiphieuchi: string;
    public chungtu: string;
    public khachhang_id: number;
    public nhacungcap_id: number;
    public sotaikhoan_id: number;
    public sotaikhoan: string;
    public nguoinhan_hoten: string;
    public quychi_id: number;
    public noidungthuchi_id: number;
    public sotienchi: number;
    public sotiengiam: number;
    public sotienchi_du: number;
    public lenhvay_id: number;
    public sotienchi_lenhvay: number;
    public sotienchi_laixuat: number;
    public nguoinhan_diachi: string;
    public nguoinhan_dienthoai: string;
    public donvigiacong_id: number;
    public khogiacong_id: number;

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
        ngaychi: Date = new Date(),
        maphieuchi: string = null,
        loaiphieuchi: string = null,
        chungtu: string = null,
        khachhang_id: number = null,
        nhacungcap_id: number = null,
        sotaikhoan_id: number = null,
        sotaikhoan: string = null,
        nguoinhan_hoten: string = null,
        quychi_id: number = null,
        noidungthuchi_id: number = null,
        sotienchi: number = 0,
        sotiengiam: number = 0,
        sotienchi_du: number = null,
        lenhvay_id: number = null,
        sotienchi_lenhvay: number = null,
        sotienchi_laixuat: number = null,
        nguoinhan_diachi: string = null,
        nguoinhan_dienthoai: string = null,
        donvigiacong_id: number = null,
        khogiacong_id: number = null,

        nocu: number = 0,
        tongchi: number = 0,
        conno: number = 0,

        phieuchi_phieunhapkhos: PhieuChi_PhieuNhapKho[] = [],
        phieuchi_phieunhapkhos_old: PhieuChi_PhieuNhapKho[] = [],

        malenhvay: string = null
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
        this.ngaychi = ngaychi;
        this.maphieuchi = maphieuchi;
        this.loaiphieuchi = loaiphieuchi;
        this.chungtu = chungtu;
        this.khachhang_id = khachhang_id;
        this.nhacungcap_id = nhacungcap_id;
        this.sotaikhoan_id = sotaikhoan_id;
        this.sotaikhoan = sotaikhoan;
        this.nguoinhan_hoten = nguoinhan_hoten;
        this.quychi_id = quychi_id;
        this.noidungthuchi_id = noidungthuchi_id;
        this.sotienchi = sotienchi;
        this.sotiengiam = sotiengiam;
        this.sotienchi_du = sotienchi_du;
        this.lenhvay_id = lenhvay_id;
        this.sotienchi_lenhvay = sotienchi_lenhvay;
        this.sotienchi_laixuat = sotienchi_laixuat;
        this.nguoinhan_diachi = nguoinhan_diachi;
        this.nguoinhan_dienthoai = nguoinhan_dienthoai;
        this.donvigiacong_id = donvigiacong_id;
        this.khogiacong_id = khogiacong_id;

        this.nocu = nocu;
        this.tongchi = tongchi;
        this.conno = conno;

        this.phieuchi_phieunhapkhos = phieuchi_phieunhapkhos;
        this.phieuchi_phieunhapkhos_old = phieuchi_phieunhapkhos_old;

        this.malenhvay = malenhvay;
    }
}

export class PhieuChi_PhieuNhapKho {
    public id: number;
    public phieuchi_id: number;
    public phieunhapkho_id: number;
    public loaiphieunhapkho: string;
    public sotienchi: number;
    public sotiengiam: number;
    public chuthich: string;

    public ngaynhapkho: Date;
    public maphieunhapkho: string;
    public cothuevat: boolean;
    public thuevat: number;
    public tongthanhtien: number;
    public sotienchitruoc: number;

    constructor(
        id: number = null,
        phieuchi_id: number = null,
        phieunhapkho_id: number = null,
        loaiphieunhapkho: string = null,
        sotienchi: number = 0,
        sotiengiam: number = 0,
        chuthich: string = null,
        cothuevat: boolean = null,
        thuevat: number = 0,
        tongthanhtien: number = 0,
        sotienchitruoc: number = 0
    ) {
        this.id = id;
        this.phieuchi_id = phieuchi_id;
        this.phieunhapkho_id = phieunhapkho_id;
        this.loaiphieunhapkho = loaiphieunhapkho;
        this.sotienchi = sotienchi;
        this.sotiengiam = sotiengiam;
        this.chuthich = chuthich;
        this.cothuevat = cothuevat;
        this.thuevat = thuevat;
        this.tongthanhtien = tongthanhtien;
        this.sotienchitruoc = sotienchitruoc;
    }
}
