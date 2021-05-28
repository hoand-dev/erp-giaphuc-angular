export class PhieuNhapKhoGiaCong {
    public phieunhapkhogiacong_chitiets: PhieuNhapKhoGiaCongCT[];

    nhanviensale_hoten: string;
    biensoxe: string;
    ngaylapphieu: string;
    inphieu_thoigian: string;
    inphieu_hoten: string;
    tentaixe: string;

    tenkhoxuat: string;

    public tendonvigiacong: string;
    public tenkhogiacong: string;
    public tenkhonhap: string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

    public matuphieu: string;

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
    public ngaynhapkhogiacong: Date;
    public maphieunhapkhogiacong: string;
    public donvigiacong_id: number;
    public khogiacong_id: number;
    public khonhap_id: number;
    public tongthanhtien: number;
    public phieuyeucaugiacong_id: number;
    public loaiphieu: string;
    public xuatnguyenlieu: boolean;

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
        ngaynhapkhogiacong: Date = new Date(),
        maphieunhapkhogiacong: string = null,
        donvigiacong_id: number = null,
        khogiacong_id: number = null,
        khonhap_id: number = null,
        tongthanhtien: number = 0,
        phieuyeucaugiacong_id: number = null,
        loaiphieu: string = null,
        xuatnguyenlieu: boolean = null,

        phieunhapkhogiacong_chitiets: PhieuNhapKhoGiaCongCT[] = []
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
        this.ngaynhapkhogiacong = ngaynhapkhogiacong;
        this.maphieunhapkhogiacong = maphieunhapkhogiacong;
        this.donvigiacong_id = donvigiacong_id;
        this.khogiacong_id = khogiacong_id;
        this.khonhap_id = khonhap_id;
        this.tongthanhtien = tongthanhtien;
        this.phieuyeucaugiacong_id = phieuyeucaugiacong_id;
        this.loaiphieu = loaiphieu;
        this.xuatnguyenlieu = xuatnguyenlieu;

        this.phieunhapkhogiacong_chitiets = phieunhapkhogiacong_chitiets;
    }
}

export class PhieuNhapKhoGiaCongCT {
    public lois: string;
    public phiphatsinhs: string;
    public chitietlois: LoiGiaCong[] = [];
    public chitietphiphatsinhs: PhiPhatSinh[] = [];
    public noidungphatsinh: string; // in phiếu

    public tenhanghoa: string;
    public tensomat: string;
    public tenyeucau: string;

    public tenkhachhang: string;

    public yeucaus: string;
    public arr_yeucaus: number[];

    public mathanhpham: string;
    public tenthanhpham: string;

    public trongluong: number = 0;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public id: number;
    public phieunhapkhogiacong_id: number;
    public khogiacong_id: number;
    public khonhap_id: number;
    public loaihanghoa: string;
    public thanhpham_id: number;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public somat_id: number;
    public heso: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;
    public dongiavon: number;
    public phieuyeucaugiacongct_id: number;
    public soluongloi: number;
    public khonhaploi_id: number;
    public somat_thanhpham_id: number;
    public xuatnguyenlieu: boolean;
    public khachhang_id: number;
    public phiphatsinh: number;

    public tongtrongluong: number = 0;
    public tongkien: number = 0;
    public tongm3: number = 0;
    public m3: number = 0;
    public soluongconlai: number = 0;

    constructor(
        id: number = null,
        phieunhapkhogiacong_id: number = null,
        khogiacong_id: number = null,
        khonhap_id: number = null,
        loaihanghoa: string = null,
        thanhpham_id: number = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = null,
        somat_id: number = null,
        heso: number = 1,
        soluong: number = 0,
        dongia: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        dongiavon: number = 0,
        phieuyeucaugiacongct_id: number = null,
        soluongloi: number = 0,
        khonhaploi_id: number = null,
        somat_thanhpham_id: number = null,
        xuatnguyenlieu: boolean = null,
        khachhang_id: number = null,
        phiphatsinh: number = 0,

        yeucaus: string = null,
        arr_yeucaus: number[] = []
    ) {
        this.id = id;
        this.phieunhapkhogiacong_id = phieunhapkhogiacong_id;
        this.khogiacong_id = khogiacong_id;
        this.khonhap_id = khonhap_id;
        this.loaihanghoa = loaihanghoa;
        this.thanhpham_id = thanhpham_id;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.somat_id = somat_id;
        this.heso = heso;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.dongiavon = dongiavon;
        this.phieuyeucaugiacongct_id = phieuyeucaugiacongct_id;
        this.soluongloi = soluongloi;
        this.khonhaploi_id = khonhaploi_id;
        this.somat_thanhpham_id = somat_thanhpham_id;
        this.xuatnguyenlieu = xuatnguyenlieu;
        this.khachhang_id = khachhang_id;
        this.phiphatsinh = phiphatsinh;

        this.yeucaus = yeucaus;
        this.arr_yeucaus = arr_yeucaus;
    }
}

export class LoiGiaCong {
    public phieunhapkhogiacongct_id: number;
    public danhmucloi_id: number;
    public soluong: number;

    constructor(phieunhapkhogiacongct_id: number = null, danhmucloi_id: number = null, soluong: number = 0) {
        this.phieunhapkhogiacongct_id = phieunhapkhogiacongct_id;
        this.danhmucloi_id = danhmucloi_id;
        this.soluong = soluong;
    }
}

export class PhiPhatSinh {
    public phieunhapkhogiacongct_id: number;
    public danhmucphi_id: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;

    constructor(phieunhapkhogiacongct_id: number = null, danhmucphi_id: number = null, soluong: number = 0, dongia: number = 0, thanhtien: number = 0) {
        this.phieunhapkhogiacongct_id = phieunhapkhogiacongct_id;
        this.danhmucphi_id = danhmucphi_id;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
    }
}
