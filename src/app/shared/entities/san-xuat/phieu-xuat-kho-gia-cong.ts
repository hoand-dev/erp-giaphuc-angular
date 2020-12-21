export class PhieuXuatKhoGiaCong {
    public phieuxuatkhogiacong_chitiets: PhieuXuatKhoGiaCong_ChiTiet[];
    public phieuxuatkhogiacong_chitiets_old: PhieuXuatKhoGiaCong_ChiTiet[];

    public tendonvigiacong: string;
    public tenkhogiacong: string;
    public tenkhoxuat: string;
    public biensoxe: string;
    public tentaixe: string;

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
    public loaiphieuxuat: string;
    public ngayxuatkhogiacong: Date;
    public maphieuxuatkhogiacong: string;
    public khoxuat_id: number;
    public khogiacong_id: number;
    public donvigiacong_id: number;
    public xe_id: number;
    public taixe_id: number;
    public taixe_dienthoai: string;
    public nguoinhan_dienthoai: string;
    public nguoinhan_diachi: string;
    public nguoinhan_hoten: string;

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
        loaiphieuxuat: string = null,
        ngayxuatkhogiacong: Date = new Date(),
        maphieuxuatkhogiacong: string = null,
        khoxuat_id: number = null,
        khogiacong_id: number = null,
        donvigiacong_id: number = null,
        xe_id: number = null,
        taixe_id: number = null,
        taixe_dienthoai: string = null,
        nguoinhan_dienthoai: string = null,
        nguoinhan_diachi: string = null,
        nguoinhan_hoten: string = null,
        phieuxuatkhogiacong_chitiets: PhieuXuatKhoGiaCong_ChiTiet[] = [],
        phieuxuatkhogiacong_chitiets_old: PhieuXuatKhoGiaCong_ChiTiet[] = []
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
        this.loaiphieuxuat = loaiphieuxuat;
        this.ngayxuatkhogiacong = ngayxuatkhogiacong;
        this.maphieuxuatkhogiacong = maphieuxuatkhogiacong;
        this.khoxuat_id = khoxuat_id;
        this.khogiacong_id = khogiacong_id;
        this.donvigiacong_id = donvigiacong_id;
        this.xe_id = xe_id;
        this.taixe_id = taixe_id;
        this.taixe_dienthoai = taixe_dienthoai;
        this.nguoinhan_dienthoai = nguoinhan_dienthoai;
        this.nguoinhan_diachi = nguoinhan_diachi;
        this.nguoinhan_hoten = nguoinhan_hoten;

        this.phieuxuatkhogiacong_chitiets = phieuxuatkhogiacong_chitiets;
        this.phieuxuatkhogiacong_chitiets_old = phieuxuatkhogiacong_chitiets_old;
    }
}

export class PhieuXuatKhoGiaCong_ChiTiet {
    public trongluong: number;
    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public id: number;
    public phieuxuatkhogiacong_id: number;
    public khoxuat_id: number;
    public khogiacong_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public tilequydoiphu: number;
    public soluong: number;
    public chuthich: string;

    constructor(
        id: number = null,
        phieuxuatkhogiacong_id: number = null,
        khoxuat_id: number = null,
        khogiacong_id: number = null,
        loaihanghoa: string = null,
        hanghoa_id: number = null,
        hanghoa_lohang_id: number = null,
        dvt_id: number = null,
        tilequydoi: number = 1,
        soluong: number = 0,
        chuthich: string = null
    ) {
        this.id = id;
        this.phieuxuatkhogiacong_id = phieuxuatkhogiacong_id;
        this.khoxuat_id = khoxuat_id;
        this.khogiacong_id = khogiacong_id;
        this.loaihanghoa = loaihanghoa;
        this.hanghoa_id = hanghoa_id;
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.dvt_id = dvt_id;
        this.tilequydoi = tilequydoi;
        this.soluong = soluong;
        this.chuthich = chuthich;
    }
}
