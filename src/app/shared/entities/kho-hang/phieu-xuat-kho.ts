import { KhoHang } from '../thiet-lap';
import { DanhSachXe } from '../thiet-lap/danh-sach-xe';
import { TaiXe } from '../thiet-lap/tai-xe';

export class PhieuXuatKho {
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
    public maphieuxuatkho: string;
    public ngayxuatkho: Date;
    public loaiphieuxuatkho: string;
    public khoxuat_id: number;
    public phieubanhang_id: number;
    public phieutrahangncc_id: number;
    public notienmat: boolean;
    public cothuevat: boolean;
    public chungtu: string;
    public tongtienhang: number;
    public cuocvanchuyen: number;
    public chietkhau: number;
    public thuevat: number;
    public tongthanhtien: number;
    public ngaytoihan: Date;
    public songaytoihan: number;
    public xe_id: number;
    public taixe_id: number;
    public taixe_dienthoai: string;
    public khachhang_id: number;
    public nhacungcap_id: number;
    public nguoinhan_hoten: string;
    public nguoinhan_diachi: string;
    public nguoinhan_dienthoai: string;
    public sotiendathu: number;
    public trangthaithu: string;

    public phieuxuatkho_chitiets: PhieuXuatKho_ChiTiet[];

    public tumaphieu: string;

    public taixe: TaiXe;
    public taixe_hoten: string;

    public xe: DanhSachXe;
    public biensoxe: string;

    public khoxuat: KhoHang;
    public tenkhoxuat: string;

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
        maphieuxuatkho: string = null,
        ngayxuatkho: Date = new Date(),
        loaiphieuxuatkho: string = null,
        khoxuat_id: number = null,
        phieubanhang_id: number = null,
        phieutrahangncc_id: number = null,
        notienmat: boolean = null,
        cothuevat: boolean = null,
        chungtu: string = null,
        tongtienhang: number = 0,
        cuocvanchuyen: number = 0,
        chietkhau: number = 0,
        thuevat: number = 0,
        tongthanhtien: number = 0,
        ngaytoihan: Date = null,
        songaytoihan: number = 0,
        xe_id: number = null,
        taixe_id: number = null,
        taixe_dienthoai: string = null,
        khachhang_id: number = null,
        nhacungcap_id: number = null,
        nguoinhan_hoten: string = null,
        nguoinhan_diachi: string = null,
        nguoinhan_dienthoai: string = null,
        sotiendathu: number = 0,
        trangthaithu: string = null,

        phieuxuatkho_chitiets: PhieuXuatKho_ChiTiet[] = [],

        taixe: TaiXe = null,
        xe: DanhSachXe = null,
        khoxuat: KhoHang = null
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
        this.maphieuxuatkho = maphieuxuatkho;
        this.ngayxuatkho = ngayxuatkho;
        this.loaiphieuxuatkho = loaiphieuxuatkho;
        this.khoxuat_id = khoxuat_id;
        this.phieubanhang_id = phieubanhang_id;
        this.phieutrahangncc_id = phieutrahangncc_id;
        this.notienmat = notienmat;
        this.cothuevat = cothuevat;
        this.chungtu = chungtu;
        this.tongtienhang = tongtienhang;
        this.cuocvanchuyen = cuocvanchuyen;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.tongthanhtien = tongthanhtien;
        this.ngaytoihan = ngaytoihan;
        this.songaytoihan = songaytoihan;
        this.xe_id = xe_id;
        this.taixe_id = taixe_id;
        this.taixe_dienthoai = taixe_dienthoai;
        this.khachhang_id = khachhang_id;
        this.nhacungcap_id = nhacungcap_id;
        this.nguoinhan_hoten = nguoinhan_hoten;
        this.nguoinhan_diachi = nguoinhan_diachi;
        this.nguoinhan_dienthoai = nguoinhan_dienthoai;
        this.sotiendathu = sotiendathu;
        this.trangthaithu = trangthaithu;

        this.phieuxuatkho_chitiets = phieuxuatkho_chitiets;

        this.taixe = taixe;
        this.xe = xe;
        this.khoxuat = khoxuat;
    }
}

export class PhieuXuatKho_ChiTiet {
    public id: number;
    public phieuxuatkho_id: number;
    public khoxuat_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public soluong: number;
    public dongia: number;
    public cuocvanchuyen: number;
    public chietkhau: number;
    public thuevat: number;
    public thanhtien: number;
    public chuthich: string;
    public tenhanghoa_inphieu: string;
    public phieubanhang_chitiet_id: number;
    public phieutrahangncc_chitiet_id: number;

    public mahanghoa: string;
    public tenhanghoa: string;

    public tendonvitinh: string;

    constructor(
        id: number = null,
        phieuxuatkho_id: number = null,
        khoxuat_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        soluong: number = 0,
        dongia: number = 0,
        cuocvanchuyen: number = 0,
        chietkhau: number = 0,
        thuevat: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        tenhanghoa_inphieu: string = null,
        phieubanhang_chitiet_id: number = null,
        phieutrahangncc_chitiet_id: number = null
    ) {
        this.id = id;
        this.phieuxuatkho_id = phieuxuatkho_id;
        this.khoxuat_id = khoxuat_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.soluong = soluong;
        this.dongia = dongia;
        this.cuocvanchuyen = cuocvanchuyen;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.tenhanghoa_inphieu = tenhanghoa_inphieu;
        this.phieubanhang_chitiet_id = phieubanhang_chitiet_id;
        this.phieutrahangncc_chitiet_id = phieutrahangncc_chitiet_id;
    }
}
