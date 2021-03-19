export class PhieuYeuCauGiaCong {
    public phieuyeucaugiacong_chitiets: PhieuYeuCauGiaCongCT[];

    nhanviensale_hoten: string;
    biensoxe: string;
    ngaylapphieu: string;
    inphieu_thoigian: string;
    inphieu_hoten: string;
    tentaixe: string;

    tenkhoxuat: string;

    public tendonvigiacong: string;
    public tenkhogiacong: string;

    public nguoitao_hoten: string;
    public nguoisua_hoten: string;

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
    public ngayyeucaugiacong: Date;
    public maphieuyeucaugiacong: string;
    public donvigiacong_id: number;
    public khogiacong_id: number;
    public tongthanhtien: number;
    public trangthainhap: string;
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
        ngayyeucaugiacong: Date = new Date(),
        maphieuyeucaugiacong: string = null,
        donvigiacong_id: number = null,
        khogiacong_id: number = null,
        tongthanhtien: number = 0,
        trangthainhap: string = null,
        loaiphieu: string = null,
        xuatnguyenlieu: boolean = true,

        phieuyeucaugiacong_chitiets: PhieuYeuCauGiaCongCT[] = []
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
        this.ngayyeucaugiacong = ngayyeucaugiacong;
        this.maphieuyeucaugiacong = maphieuyeucaugiacong;
        this.donvigiacong_id = donvigiacong_id;
        this.khogiacong_id = khogiacong_id;
        this.tongthanhtien = tongthanhtien;
        this.trangthainhap = trangthainhap;
        this.loaiphieu = loaiphieu;
        this.xuatnguyenlieu = xuatnguyenlieu;

        this.phieuyeucaugiacong_chitiets = phieuyeucaugiacong_chitiets;
    }
}

export class PhieuYeuCauGiaCongCT {
    public yeucaus: string;
    public arr_yeucaus: number[];
    public tenyeucau: string;

    public mathanhpham: string;
    public tenthanhpham: string;

    public trongluong: number = 0;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public id: number;
    public phieuyeucaugiacong_id: number;
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
    public heso: number;
    public soluongtattoan: number;
    public soluong: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;
    public dongiavon: number;
    public soluongdanhap: number;
    public trangthainhap: string;
    public phieudathang_chitiet_id: number;
    public xuatnguyenlieu: boolean;

    public tongtrongluong: number = 0;
    public tongkien: number = 0;
    public tongm3: number = 0;
    public m3: number = 0;
    public soluongconlai: number = 0;

    constructor(
        id: number = null,
        phieuyeucaugiacong_id: number = null,
        khogiacong_id: number = null,
        loaihanghoa: string = null,
        thanhpham_id: number = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        somat_id: number = null,
        somat_thanhpham_id: number = null,
        heso: number = 1,
        soluongtattoan: number = 0,
        soluong: number = 0,
        dongia: number = 0,
        thanhtien: number = 0,
        chuthich: string = null,
        dongiavon: number = 0,
        soluongdanhap: number = 0,
        trangthainhap: string = null,

        xuatnguyenlieu: boolean = true,
        yeucaus: string = null,
        arr_yeucaus: number[] = [],
        phieudathang_chitiet_id: number = null
    ) {
        this.id = id;
        this.phieuyeucaugiacong_id = phieuyeucaugiacong_id;
        this.khogiacong_id = khogiacong_id;
        this.loaihanghoa = loaihanghoa;
        this.thanhpham_id = thanhpham_id;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.somat_id = somat_id;
        this.somat_thanhpham_id = somat_thanhpham_id;
        this.heso = heso;
        this.soluongtattoan = soluongtattoan;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien = thanhtien;
        this.chuthich = chuthich;
        this.dongiavon = dongiavon;
        this.soluongdanhap = soluongdanhap;
        this.trangthainhap = trangthainhap;

        this.xuatnguyenlieu = xuatnguyenlieu;
        this.yeucaus = yeucaus;
        this.arr_yeucaus = arr_yeucaus;
        this.phieudathang_chitiet_id = phieudathang_chitiet_id;
    }
}
