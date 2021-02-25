import { KhoHang, NhaCungCap } from '../thiet-lap';

export class PhieuTraHangNCC {
    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

    public manhacungcap: string;

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
    public ngaytrahangncc: Date;
    public maphieutrahangncc: string;
    public nhacungcap_id: number;
    public tongtienhang: number;
    public thuevat: number;
    public chietkhau: number;
    public tongthanhtien: number;
    public trangthaixuat: string;
    public khoxuat_id: number;
    public phieumuahang_id: number;

    public phieutrahangncc_chitiet: PhieuTraHangNCC_ChiTiet[];

    /* các thông tin hiển thị trên view */
    public maphieumuahangncc: string;
    public tennhacungcap: string;
    public dienthoainhacungcap: string;
    public diachinhacungcap: string;

    public nocu: number = 0;

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
        ngaytrahangncc: Date = new Date(),
        maphieutrahangncc: string = null,
        nhacungcap_id: number = null,
        tongtienhang: number = 0,
        thuevat: number = 0,
        chietkhau: number = 0,
        tongthanhtien: number = 0,
        trangthaixuat: string = null,
        khoxuat_id: number = null,
        phieumuahang_id: number = null
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
        this.ngaytrahangncc = ngaytrahangncc;
        this.maphieutrahangncc = maphieutrahangncc;
        this.nhacungcap_id = nhacungcap_id;
        this.tongtienhang = tongtienhang;
        this.thuevat = thuevat;
        this.chietkhau = chietkhau;
        this.tongthanhtien = tongthanhtien;
        this.trangthaixuat = trangthaixuat;
        this.khoxuat_id = khoxuat_id;
        this.phieumuahang_id = phieumuahang_id;
    }
}

export class PhieuTraHangNCC_ChiTiet {
    public id: number;
    public phieutrahangncc_id: number;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public soluong: number;
    public dongia: number;
    public thuevat: number;
    public chietkhau: number;
    public cuocvanchuyen: number;
    public thanhtien: number;
    public chuthich: string;
    public khoxuat_id: number;
    public soluongdaxuat: number;
    public trangthaixuat: string;
    public loaihanghoa: string;
    public phieumuahang_chitiet_id: number;

    public trongluong: number;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    constructor(
        id: number = null,
        phieutrahangncc_id: number = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        tilequydoiphu: number = 1,
        soluong: number = 0,
        dongia: number = 0,
        thuevat: number = 0,
        chietkhau: number = 0,
        cuocvanchuyen: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        khoxuat_id: number = null,
        soluongdaxuat: number = 0,
        trangthaixuat: string = null,
        loaihanghoa: string = null,
        phieumuahang_chitiet_id: number = null,
        trongluong: number = 0
    ) {
        this.id = id;
        this.phieutrahangncc_id = phieutrahangncc_id;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.tilequydoiphu = tilequydoiphu;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thuevat = thuevat;
        this.chietkhau = chietkhau;
        this.cuocvanchuyen = cuocvanchuyen;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.khoxuat_id = khoxuat_id;
        this.soluongdaxuat = soluongdaxuat;
        this.trangthaixuat = trangthaixuat;
        this.loaihanghoa = loaihanghoa;
        this.phieumuahang_chitiet_id = phieumuahang_chitiet_id;
        this.trongluong = trongluong;
    }
}
