import { NhaCungCap } from '../thiet-lap';

export class PhieuMuaHangNCC {
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
    public ngaymuahangncc: Date;
    public maphieumuahangncc: string;
    public nhacungcap_id: number;
    public tongtienhang: number;
    public thuevat: number;
    public chietkhau: number;
    public cuocvanchuyen: number;
    public tongthanhtien: number;
    public trangthainhap: string;
    public phieudathangncc_id: number;

    public phieumuahangncc_chitiet: PhieuMuaHangNCC_ChiTiet[];

    /* các thông tin hiển thị trên view */
    public maphieudathangncc: string;
    public nhacungcap: NhaCungCap;
    public tennhacungcap: string;
    public dienthoainhacungcap: string;
    public diachinhacungcap: string;

    public nocu: number = 0;
    public tennguoitao: string = '';
    
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
        ngaymuahangncc: Date = new Date(),
        maphieumuahangncc: string = null,
        nhacungcap_id: number = null,
        tongtienhang: number = 0,
        thuevat: number = 0,
        chietkhau: number = 0,
        cuocvanchuyen: number = 0,
        tongthanhtien: number = 0,
        trangthainhap: string = null,
        nhacungcap: NhaCungCap = null,
        phieudathangncc_id: number = null
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
        this.ngaymuahangncc = ngaymuahangncc;
        this.maphieumuahangncc = maphieumuahangncc;
        this.nhacungcap_id = nhacungcap_id;
        this.tongtienhang = tongtienhang;
        this.thuevat = thuevat;
        this.chietkhau = chietkhau;
        this.cuocvanchuyen = cuocvanchuyen;
        this.tongthanhtien = tongthanhtien;
        this.trangthainhap = trangthainhap;
        this.nhacungcap = nhacungcap;
        this.phieudathangncc_id = phieudathangncc_id;
    }
}

export class PhieuMuaHangNCC_ChiTiet {
    public id: number;
    public phieumuahangncc_id: number;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public giatriquydoi_kien: number;
    public quycachdai: number;
    public quycachrong: number;
    public soluong: number;
    public dongia: number;
    public thuevat: number;
    public chietkhau: number;
    public cuocvanchuyen: number;
    public thanhtien: number;
    public chuthich: string;
    public soluongdanhapkho: number;
    public trangthainhapkho: string;
    public soluongtattoan: number;
    public loaihanghoa: string;
    public phieudathangncc_chitiet_id: number;
    
    public tendonvitinh: string;

    constructor(
        id: number = null,
        phieumuahangncc_id: number = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        giatriquydoi_kien: number = 1,
        quycachdai: number = 1,
        quycachrong: number = 1,
        soluong: number = 0,
        dongia: number = 0,
        thuevat: number = 0,
        chietkhau: number = 0,
        cuocvanchuyen: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        soluongdanhapkho: number = 0,
        trangthainhapkho: string = null,
        soluongtattoan: number = 0,
        loaihanghoa: string = null,
        phieudathangncc_chitiet_id: number = null
    ) {
        this.id = id;
        this.phieumuahangncc_id = phieumuahangncc_id;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.giatriquydoi_kien = giatriquydoi_kien;
        this.quycachdai = quycachdai;
        this.quycachrong = quycachrong;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thuevat = thuevat;
        this.chietkhau = chietkhau;
        this.cuocvanchuyen = cuocvanchuyen;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.soluongdanhapkho = soluongdanhapkho;
        this.trangthainhapkho = trangthainhapkho;
        this.soluongtattoan = soluongtattoan;
        this.loaihanghoa = loaihanghoa;
        this.phieudathangncc_chitiet_id = phieudathangncc_chitiet_id;
    }
}