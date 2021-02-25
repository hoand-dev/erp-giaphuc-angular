export class PhieuDatHang {
    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

    public makhachhang: string;

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
    public ngaydathang: Date;
    public ngaygiaohang: Date;
    public maphieudathang: string;
    public nhanviensale_id: number;
    public khachhang_id: number;
    public khachhang_hoten: string;
    public khachhang_diachi: string;
    public khachhang_dienthoai: string;
    public tongtienhang: number;
    public chietkhau: number;
    public thuevat: number;
    public tongthanhtien: number;
    public giuhang: boolean;
    public khoxuat_id: number;
    public trangthaigiao: string;

    public phieudathang_chitiet: PhieuDatHang_ChiTiet[];

    public nocu: number = 0;
    public tenkhohang: string;

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
        ngaydathang: Date = new Date(),
        ngaygiaohang: Date = null,
        maphieudathang: string = null,
        nhanviensale_id: number = null,
        khachhang_id: number = null,
        khachhang_hoten: string = null,
        khachhang_diachi: string = null,
        khachhang_dienthoai: string = null,
        tongtienhang: number = 0,
        chietkhau: number = 0,
        thuevat: number = 0,
        tongthanhtien: number = 0,
        giuhang: boolean = true,
        khoxuat_id: number = null,
        trangthaigiao: string = null,
        phieudathang_chitiet: PhieuDatHang_ChiTiet[] = null
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
        this.ngaydathang = ngaydathang;
        this.ngaygiaohang = ngaygiaohang;
        this.maphieudathang = maphieudathang;
        this.nhanviensale_id = nhanviensale_id;
        this.khachhang_id = khachhang_id;
        this.khachhang_hoten = khachhang_hoten;
        this.khachhang_diachi = khachhang_diachi;
        this.khachhang_dienthoai = khachhang_dienthoai;
        this.tongtienhang = tongtienhang;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.tongthanhtien = tongthanhtien;
        this.giuhang = giuhang;
        this.khoxuat_id = khoxuat_id;
        this.trangthaigiao = trangthaigiao;
        this.phieudathang_chitiet = phieudathang_chitiet;
    }
}

export class PhieuDatHang_ChiTiet {
    public id: number;
    public phieudathang_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public soluong: number;
    public dongia: number;
    public chietkhau: number;
    public thuevat: number;
    public thanhtien: number;
    public chuthich: string;
    public soluongdagiao: number;
    public trangthaigiao: string;
    public khoxuat_id: number;
    public soluongtattoan: number;
    public tenhanghoa_inphieu: string;

    public trongluong: number;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    constructor(
        id: number = null,
        phieudathang_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        tilequydoiphu: number = 1,
        soluong: number = 1,
        dongia: number = 0,
        chietkhau: number = 0,
        thuevat: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        soluongdagiao: number = 0,
        trangthaigiao: string = null,
        khoxuat_id: number = null,
        soluongtattoan: number = 0,
        tenhanghoa_inphieu: string = null,
        trongluong: number = 0
    ) {
        this.id = id;
        this.phieudathang_id = phieudathang_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.tilequydoiphu = tilequydoiphu;
        this.soluong = soluong;
        this.dongia = dongia;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.soluongdagiao = soluongdagiao;
        this.trangthaigiao = trangthaigiao;
        this.khoxuat_id = khoxuat_id;
        this.soluongtattoan = soluongtattoan;
        this.tenhanghoa_inphieu = tenhanghoa_inphieu;
        this.trongluong = trongluong;
    }
}
