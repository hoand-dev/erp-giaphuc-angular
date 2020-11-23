export class PhieuKhachTraHang {

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
    public ngaykhachtrahang: Date;
    public maphieukhachtrahang: string;
    public nhanviensale_id: number;
    public khachhang_id: number;
    public khachhang_hoten: string;
    public khachhang_diachi: string;
    public khachhang_dienthoai: string;
    public tongtienhang: number;
    public cuocvanchuyen: number;
    public chietkhau: number;
    public thuevat: number;
    public tongthanhtien: number;
    public khonhap_id: number;
    public trangthainhap: string;
    public phieubanhang_id: number;

    constructor(id: number = null, chinhanh_id: number = null, kichhoat: boolean = null, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, ids: number = null, sort: string = null, ngaykhachtrahang: Date = null, maphieukhachtrahang: string = null, nhanviensale_id: number = null, khachhang_id: number = null, khachhang_hoten: string = null, khachhang_diachi: string = null, khachhang_dienthoai: string = null, tongtienhang: number = null, cuocvanchuyen: number = null, chietkhau: number = null, thuevat: number = null, tongthanhtien: number = null, khonhap_id: number = null, trangthainhap: string = null, phieubanhang_id: number = null){
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
        this.ngaykhachtrahang = ngaykhachtrahang;
        this.maphieukhachtrahang = maphieukhachtrahang;
        this.nhanviensale_id = nhanviensale_id;
        this.khachhang_id = khachhang_id;
        this.khachhang_hoten = khachhang_hoten;
        this.khachhang_diachi = khachhang_diachi;
        this.khachhang_dienthoai = khachhang_dienthoai;
        this.tongtienhang = tongtienhang;
        this.cuocvanchuyen = cuocvanchuyen;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.tongthanhtien = tongthanhtien;
        this.khonhap_id = khonhap_id;
        this.trangthainhap = trangthainhap;
        this.phieubanhang_id = phieubanhang_id;
    }
}

export class PhieuKhachTraHang_ChiTiet {

    public id: number;
    public phieukhachtrahang_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public soluong: number;
    public dongia: number;
    public cuocvanchuyen: string;
    public chietkhau: number;
    public thuevat: number;
    public thanhtien: number;
    public chuthich: string;
    public khonhap_id: number;
    public soluongdanhapkho: number;
    public trangthainhapkho: string;
    public phieubanhang_chitiet_id: number;

    constructor(id: number = null, phieukhachtrahang_id: number = null, loaihanghoa: string = null, hanghoa_id: number = null, hanghoa_lohang_id: number = null, dvt_id: number = null, tilequydoi: number = null, soluong: number = null, dongia: number = null, cuocvanchuyen: string = null, chietkhau: number = null, thuevat: number = null, thanhtien: number = null, chuthich: string = null, khonhap_id: number = null, soluongdanhapkho: number = null, trangthainhapkho: string = null, phieubanhang_chitiet_id: number = null){
        this.id = id;
        this.phieukhachtrahang_id = phieukhachtrahang_id;
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
        this.khonhap_id = khonhap_id;
        this.soluongdanhapkho = soluongdanhapkho;
        this.trangthainhapkho = trangthainhapkho;
        this.phieubanhang_chitiet_id = phieubanhang_chitiet_id;
    }
}
