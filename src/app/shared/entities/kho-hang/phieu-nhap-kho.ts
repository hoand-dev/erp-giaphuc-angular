export class PhieuNhapKho {
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
    public maphieunhapkho: string;
    public ngaynhapkho: Date;
    public loaiphieunhapkho: string;
    public khonhap_id: number;
    public phieumuahang_id: number;
    public phieukhachtrahang_id: number;
    public chungtu: string;
    public tongtienhang: number;
    public cuocvanchuyen: number;
    public chietkhau: number;
    public thuevat: number;
    public tongthanhtien: number;
    public nhacungcap_id: number;
    public khachhang_id: number;
    public sotiendathu: number;
    public trangthaithu: string;
    public sotiendachi: number;
    public trangthaichi: string;

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
        maphieunhapkho: string = null,
        ngaynhapkho: Date = null,
        loaiphieunhapkho: string = null,
        khonhap_id: number = null,
        phieumuahang_id: number = null,
        phieukhachtrahang_id: number = null,
        chungtu: string = null,
        tongtienhang: number = null,
        cuocvanchuyen: number = null,
        chietkhau: number = null,
        thuevat: number = null,
        tongthanhtien: number = null,
        nhacungcap_id: number = null,
        khachhang_id: number = null,
        sotiendathu: number = null,
        trangthaithu: string = null,
        sotiendachi: number = null,
        trangthaichi: string = null
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
        this.maphieunhapkho = maphieunhapkho;
        this.ngaynhapkho = ngaynhapkho;
        this.loaiphieunhapkho = loaiphieunhapkho;
        this.khonhap_id = khonhap_id;
        this.phieumuahang_id = phieumuahang_id;
        this.phieukhachtrahang_id = phieukhachtrahang_id;
        this.chungtu = chungtu;
        this.tongtienhang = tongtienhang;
        this.cuocvanchuyen = cuocvanchuyen;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.tongthanhtien = tongthanhtien;
        this.nhacungcap_id = nhacungcap_id;
        this.khachhang_id = khachhang_id;
        this.sotiendathu = sotiendathu;
        this.trangthaithu = trangthaithu;
        this.sotiendachi = sotiendachi;
        this.trangthaichi = trangthaichi;
    }
}

export class PhieuNhapKho_ChiTiet {
    public id: number;
    public phieunhapkho_id: number;
    public khonhap_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public quycachdai: number;
    public quycachrong: number;
    public soluong: number;
    public dongia: number;
    public cuocvanchuyen: number;
    public chietkhau: number;
    public thuevat: number;
    public thanhtien: number;
    public chuthich: string;
    public tenhanghoa_inphieu: string;
    public phieumuahangncc_chitiet_id: number;
    public phieukhachtrahang_chitiet_id: number;
    public soluonghong: number;
    public khonhaphong_id: number;

    constructor(
        id: number = null,
        phieunhapkho_id: number = null,
        khonhap_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = null,
        quycachdai: number = null,
        quycachrong: number = null,
        soluong: number = null,
        dongia: number = null,
        cuocvanchuyen: number = null,
        chietkhau: number = null,
        thuevat: number = null,
        thanhtien: number = null,
        chuthich: string = null,
        tenhanghoa_inphieu: string = null,
        phieumuahangncc_chitiet_id: number = null,
        phieukhachtrahang_chitiet_id: number = null,
        soluonghong: number = null,
        khonhaphong_id: number = null
    ) {
        this.id = id;
        this.phieunhapkho_id = phieunhapkho_id;
        this.khonhap_id = khonhap_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.quycachdai = quycachdai;
        this.quycachrong = quycachrong;
        this.soluong = soluong;
        this.dongia = dongia;
        this.cuocvanchuyen = cuocvanchuyen;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.tenhanghoa_inphieu = tenhanghoa_inphieu;
        this.phieumuahangncc_chitiet_id = phieumuahangncc_chitiet_id;
        this.phieukhachtrahang_chitiet_id = phieukhachtrahang_chitiet_id;
        this.soluonghong = soluonghong;
        this.khonhaphong_id = khonhaphong_id;
    }
}