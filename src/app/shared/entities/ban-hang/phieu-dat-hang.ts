export class PhieuDatHang {
    public phieudathang_sanxuatchitiets: PhieuDatHang_SanXuatChiTiet[];
    public phieudathang_thanhphams: PhieuDatHang_ThanhPham[];

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
    public trangthaiyeucau: string;
    public trangthaiban: string;
    public trangthainhap: string;

    public phieudathang_chitiet: PhieuDatHang_ChiTiet[];

    public nocu: number = 0;
    public tenkhohang: string;
    public ngayhengiao: string;

    public nhanviensale_hoten: string;
    public tongtien_bangchu: string;
    public phieuin_thoigian: string;
    public phieuin_nguoiin: string;
    public ngaylapphieu: string;

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
        ngaygiaohang: Date = new Date(),
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
        giuhang: boolean = false,
        khoxuat_id: number = null,
        trangthaigiao: string = null,
        phieudathang_chitiet: PhieuDatHang_ChiTiet[] = [],
        phieudathang_sanxuatchitiets: PhieuDatHang_SanXuatChiTiet[] = []


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
        this.phieudathang_sanxuatchitiets = phieudathang_sanxuatchitiets;
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

    public trongluong: number = 0;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public tongtrongluong: number = 0;
    public tongkien: number = 0;
    public tongm3: number = 0;
    public m3: number = 0;
    public soluongconlai: number = 0;
    

    constructor(
        id: number = null,
        phieudathang_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        tilequydoiphu: number = 1,
        soluong: number = 0,
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

export class PhieuDatHang_SanXuatChiTiet {
    public tenyeucau: string;
    public yeucaus: string;
    public arr_yeucaus: number[];

    public tenhanghoa: string;
    public mathanhpham: string;
    public tenthanhpham: string;

    public trongluong: number = 0;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public id: number;
    public phieudathang_id: number;

    public khoxuat_id: number;
    public khonhap_id: number;
    public khogiacong_id: number;

    public loaihanghoa: string;
    public thanhpham_id: number;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public somat_id: number;
    public somat_thanhpham_id: number;

    public soluongtattoan: number;
    public soluong: number;
    public dongia: number;
    public chietkhau: number;
    public thuevat: number;
    public thanhtien: number;
    public chuthich: string;

    public soluongdayeucau: number;
    public trangthaiyeucau: string;
    public soluongdanhap  : number;
    public trangthainhap  : string;

    public tongtrongluong: number = 0;
    public tongkien: number = 0;
    public tongm3: number = 0;
    public m3: number = 0;
    public soluongconlai: number = 0;
    public dongiavat: number;

    public tensomat: string;
    public tenkhohang: string;

    constructor(
        id: number = null,
        phieudathang_id: number = null,
        khoxuat_id: number = null,
        khonhap_id: number = null,
        khogiacong_id: number = null,
        loaihanghoa: string = null,
        thanhpham_id: number = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        somat_id: number = null,
        somat_thanhpham_id: number = null,
        soluongtattoan: number = 0,
        soluong: number = 0,
        dongia: number = 0,
        chietkhau: number = 0,
        thuevat: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        soluongdanhap: number = 0,
        trangthainhap: string = null,

        yeucaus: string = null,
        arr_yeucaus: number[] = []
    ) {
        this.id = id;
        this.phieudathang_id = phieudathang_id;
        this.khoxuat_id = khoxuat_id;
        this.khonhap_id = khonhap_id;
        this.khogiacong_id = khogiacong_id;
        this.loaihanghoa = loaihanghoa;
        this.thanhpham_id = thanhpham_id;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.somat_id = somat_id;
        this.somat_thanhpham_id = somat_thanhpham_id;
        this.soluongtattoan = soluongtattoan;
        this.soluong = soluong;
        this.dongia = dongia;
        this.chietkhau = chietkhau;
        this.thuevat = thuevat;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.soluongdanhap = soluongdanhap;
        this.trangthainhap = trangthainhap;

        this.yeucaus = yeucaus;
        this.arr_yeucaus = arr_yeucaus;
    }
}

export class HangHoaDatHang extends PhieuDatHang_SanXuatChiTiet {
    public ngayphatsinh  : Date  ;
    public maphieu       : string;
    public khachhang_id  : number;
    public khachhang     : string;
    public khoxuat       : string;
    public khonhap       : string;
    public khogiacong    : string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;
    public thoigiantao   : Date  ;
}


export class PhieuDatHang_ThanhPham{
    public tenthanhpham                  : string;
    
    public id                            : number;
    public thanhpham_id                  : number;
    public khonhap_id                    : number;
    public dvt_id                        : number;
    public tilequydoi                    : number;
    public loaihanghoa                   : string;
    public soluong                       : number;
    public soluongtattoan                : number;
    public soluongdaban                  : number;
    public trangthaiban                  : string;
    public phieudathang_sanxuatchitiet_id: number;
    
    public dongia                        : number;
    public chietkhau                     : number;
    public thuevat                       : number;
    public thanhtien                     : number;
}