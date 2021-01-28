export class PhieuXuatMuonHang {
    public phieuxuatmuonhang_chitiets: PhieuXuatMuonHang_ChiTiet[] = [];

    public ngaylapphieu: string;
    public inphieu_hoten: string;
    public inphieu_thoigian: string;
    
    public tenkhoxuat: string;
    public tenkhonhap: string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

    public id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public ids: number;
    public sort: string;

    public ngayxuatmuonhang: Date;
    public maphieuxuatmuonhang: string;
    public chinhanh_id: number;
    public khoxuat_id: number;
    public khonhap_id: number;
    public trangthaitra: string;
    public sotiendathu: number;
    public trangthaithu: string;
    public tongthanhtien: number;

    constructor(
        id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        ids: number = null,
        sort: string = null,
        ngayxuatmuonhang: Date = new Date(),
        maphieuxuatmuonhang: string = null,
        chinhanh_id: number = null,
        khoxuat_id: number = null,
        khonhap_id: number = null,
        trangthaitra: string = null,
        sotiendathu: number = 0,
        trangthaithu: string = null,
        tongthanhtien: number = 0
    ) {
        this.id = id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.ids = ids;
        this.sort = sort;
        this.ngayxuatmuonhang = ngayxuatmuonhang;
        this.maphieuxuatmuonhang = maphieuxuatmuonhang;
        this.chinhanh_id = chinhanh_id;
        this.khoxuat_id = khoxuat_id;
        this.khonhap_id = khonhap_id;
        this.trangthaitra = trangthaitra;
        this.sotiendathu = sotiendathu;
        this.trangthaithu = trangthaithu;
        this.tongthanhtien = tongthanhtien;
    }
}

export class PhieuXuatMuonHang_ChiTiet {
    /* liên kết vs khoá ngoại và thông tin thêm */
    public mahanghoa: string;
    public tenhanghoa: string;
    public trongluong: number;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public id: number;
    public phieuxuatmuonhang_id: number;
    public khoxuat_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;
    public soluongdatra: number;
    public trangthaitra: string;

    constructor(
        id: number = null,
        phieuxuatmuonhang_id: number = null,
        khoxuat_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        soluong: number = 1,
        dongia: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        soluongdatra: number = 0,
        trangthaitra: string = null
    ) {
        this.id = id;
        this.phieuxuatmuonhang_id = phieuxuatmuonhang_id;
        this.khoxuat_id = khoxuat_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.soluongdatra = soluongdatra;
        this.trangthaitra = trangthaitra;
    }
}
