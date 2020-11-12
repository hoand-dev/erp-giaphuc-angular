import { NhomKhachHang } from './nhom-khach-hang';
import { KhuVuc } from './khu-vuc';

export class KhachHang {
    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public makhachhang: string;
    public tenkhachhang: string;
    public sodienthoai: string;
    public diachi: string;
    public masothue: string;
    public congnobandau: number;
    public nhomkhachhang_id: number;
    public khuvuc_id: number;
    public sotaikhoan: string;
    public tenchutaikhoan: string;
    public dinhmuccongno: number;
    public ngaytoihan: Date;
    public songayno: number;
    public nguoidaidien: string;
    public chucvu: string;
    public dathucongno: number;
    public email: string;

    public nhomkhachang: NhomKhachHang;
    public tennhomkhachhang: String;

    public khuvuc: KhuVuc;
    public tenkhuvuc: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        makhachhang: string = null,
        tenkhachhang: string = null,
        sodienthoai: string = null,
        diachi: string = null,
        masothue: string =null,
        congnobandau: number = null,
        nhomkhachhang_id: number = null,
        khuvuc_id: number = null,
        sotaikhoan: string = null,
        tenchutaikhoan: string = null,
        dinhmuccongno: number = null,
        ngaytoihan: Date = null,
        songayno: number = null,
        nguoidaidien: string = null,
        chucvu: string = null,
        dathucongno: number = null,
        email: string = null,
        nhomkhachang: NhomKhachHang = null,
        tennhomkhachhang: string = null,

        khuvuc: KhuVuc = null,
        tenkhuvuc: string = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.makhachhang = makhachhang;
        this.tenkhachhang = tenkhachhang;
        this.sodienthoai = sodienthoai;
        this.diachi = diachi;
        this.masothue = masothue;
        this.congnobandau = congnobandau;
        this.nhomkhachhang_id = nhomkhachhang_id;
        this.khuvuc_id = khuvuc_id;
        this.sotaikhoan = sotaikhoan;
        this.tenchutaikhoan = tenchutaikhoan;
        this.dinhmuccongno = dinhmuccongno;
        this.ngaytoihan = ngaytoihan;
        this.songayno = songayno;
        this.nguoidaidien = nguoidaidien;
        this.chucvu = chucvu;
        this.dathucongno = dathucongno;
        this.email = email;
        this.nhomkhachang = nhomkhachang;
        this.tennhomkhachhang = tennhomkhachhang;

        this.khuvuc = khuvuc;
        this.tenkhuvuc = tenkhuvuc;
    }
}