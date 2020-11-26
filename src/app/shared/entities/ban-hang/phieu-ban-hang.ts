import { KhachHang, NguoiDung } from '../thiet-lap';

export class PhieuBanHang {

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
    public ngaybanhang: Date;
    public ngaygiaohang: Date;
    public maphieubanhang: string;
    public nhanviensale_id: number;
    public khachhang_id: number;
    public khachhang_hoten: string;
    public khachhang_diachi: string;
    public khachhang_dienthoai: string;
    public songayno: number;
    public tongtienhang: number;
    public cuocvanchuyen: number;
    public chietkhau: number;
    public thuevat: number;
    public tongthanhtien: number;
    public notienmat: boolean;
    public xuathoadon: boolean;
    public khoxuat_id: number;
    public trangthaixuat: string;
    public phieudathang_id: number;

    public phieubanhang_chitiet: PhieuBanHang_ChiTiet [];

    /* các thông tin hiển thị trên view được lấy từ các bảng khác */

    public maphieudathang: string;
    public khachhang: KhachHang;
    public tenkhachhang: string;
    public sodienthoaikhachhang: string;
    public diachikhachhang: string;

    public nguoidung: NguoiDung;
    public hoten: string;

    public nocu: number =0;
    public tennguoitao: '';

    

    constructor(id: number = null, 
        chinhanh_id: number = null, 
        kichhoat: boolean = true, 
        nguoitao_id: number = null, 
        thoigiantao: Date = null, 
        nguoisua_id: number = null, 
        thoigiansua: Date = null, 
        ghichu: string = null, 
        ids: number = null, 
        sort: string = null, 
        ngaybanhang: Date = new Date(), 
        ngaygiaohang: Date = null, 
        maphieubanhang: string = null, 
        nhanviensale_id: number = null, 
        khachhang_id: number = null, 
        khachhang_hoten: string = null, 
        khachhang_diachi: string = null, 
        khachhang_dienthoai: string = null, 
        songayno: number = null, 
        tongtienhang: number = 0, 
        cuocvanchuyen: number = 0, 
        chietkhau: number = 0, 
        thuevat: number = 0, 
        tongthanhtien: number = 0, 
        notienmat: boolean = null, 
        xuathoadon: boolean = null, 
        khoxuat_id: number = null, 
        trangthaixuat: string = null, 
        phieudathang_id: number = null,
        hoten: string = null,
        )
        {
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
        this.ngaybanhang = ngaybanhang;
        this.ngaygiaohang = ngaygiaohang;
        this.maphieubanhang = maphieubanhang;
        this.nhanviensale_id = nhanviensale_id;
        this.khachhang_id = khachhang_id;
        this.khachhang_hoten = khachhang_hoten;
        this.khachhang_diachi = khachhang_diachi;
        this.khachhang_dienthoai = khachhang_dienthoai;
        this.songayno = songayno;
        this.tongtienhang = tongtienhang;
        this.cuocvanchuyen = cuocvanchuyen;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.tongthanhtien = tongthanhtien;
        this.notienmat = notienmat;
        this.xuathoadon = xuathoadon;
        this.khoxuat_id = khoxuat_id;
        this.trangthaixuat = trangthaixuat;
        this.phieudathang_id = phieudathang_id;
        this.hoten = hoten;
    }
}

export class PhieuBanHang_ChiTiet {

    public id: number;
    public phieubanhang_id: number;
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
    public khoxuat_id: number;
    public soluongdaxuatkho: number;
    public trangthaixuatkho: string;
    public soluong_tudondathang: number;
    public phieudathang_chitiet_id: number;
    public soluongtattoan: number;

    public phieudathang_chitiet: number;

    constructor(
        id: number = null, 
        phieubanhang_id: number = null, 
        loaihanghoa: string = null, 
        hanghoa_id: number = null, 
        hanghoa_lohang_id: number = null, 
        dvt_id: number = null, 
        tilequydoi: number = null, 
        soluong: number = 0, 
        dongia: number = 0, 
        cuocvanchuyen: number = 0, 
        chietkhau: number = 0, 
        thuevat: number = 0, 
        thanhtien: number = 0, 
        chuthich: string = null, 
        tenhanghoa_inphieu: string = null, 
        khoxuat_id: number = null, 
        soluongdaxuatkho: number = null, 
        trangthaixuatkho: string = null, 
        soluong_tudondathang: number = null, 
        phieudathang_chitiet_id: number = null, 
        soluongtattoan: number = null
        
        )
        {
        this.id = id;
        this.phieubanhang_id = phieubanhang_id;
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
        this.khoxuat_id = khoxuat_id;
        this.soluongdaxuatkho = soluongdaxuatkho;
        this.trangthaixuatkho = trangthaixuatkho;
        this.soluong_tudondathang = soluong_tudondathang;
        this.phieudathang_chitiet_id = phieudathang_chitiet_id;
        this.soluongtattoan = soluongtattoan;
    }
}