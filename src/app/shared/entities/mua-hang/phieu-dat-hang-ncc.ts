import { NhaCungCap } from '../thiet-lap';

export class PhieuDatHangNCC {
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
    public ngaydathangncc: Date;
    public ngaynhanhang_dukien: Date;
    public maphieudathangncc: string;
    public nhacungcap_id: number;
    public tongtienhang: number;
    public thuevat: number;
    public chietkhau: number;
    public tongthanhtien: number;
    public trangthainhan: string;
    public dieukien_thanhtoan: string;
    public diachi_giaohang: string;

    public phieudathangncc_chitiet: PhieuDatHangNCC_ChiTiet[];

    /* các thông tin hiển thị trên view */
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
        ngaydathangncc: Date = new Date(),
        ngaynhanhang_dukien: Date = null,
        maphieudathangncc: string = null,
        nhacungcap_id: number = null,
        tongtienhang: number = 0,
        thuevat: number = 0,
        chietkhau: number = 0,
        tongthanhtien: number = 0,
        trangthainhan: string = null,
        dieukien_thanhtoan: string = null,
        diachi_giaohang: string = null,
        nhacungcap: NhaCungCap = null,
        phieudathangncc_chitiet: PhieuDatHangNCC_ChiTiet[] = null
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
        this.ngaydathangncc = ngaydathangncc;
        this.ngaynhanhang_dukien = ngaynhanhang_dukien;
        this.maphieudathangncc = maphieudathangncc;
        this.nhacungcap_id = nhacungcap_id;
        this.tongtienhang = tongtienhang;
        this.thuevat = thuevat;
        this.chietkhau = chietkhau;
        this.tongthanhtien = tongthanhtien;
        this.trangthainhan = trangthainhan;
        this.dieukien_thanhtoan = dieukien_thanhtoan;
        this.diachi_giaohang = diachi_giaohang;

        this.nhacungcap = nhacungcap;
        this.phieudathangncc_chitiet = phieudathangncc_chitiet;
    }
}

export class PhieuDatHangNCC_ChiTiet {
    public id: number;
    public phieudathangncc_id: number;
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
    public thanhtien: number;
    public chuthich: string;
    public soluongdanhan: number;
    public trangthainhan: string;

    public tendonvitinh: string;

    constructor(
        id: number = null,
        phieudathangncc_id: number = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        giatriquydoi_kien: number = 1,
        quycachdai: number = 1,
        quycachrong: number = 1,
        soluong: number = 1,
        dongia: number = 0,
        thuevat: number = 0,
        chietkhau: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        soluongdanhan: number = 0,
        trangthainhan: string = null
    ) {
        this.id = id;
        this.phieudathangncc_id = phieudathangncc_id;
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
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.soluongdanhan = soluongdanhan;
        this.trangthainhan = trangthainhan;
    }
}