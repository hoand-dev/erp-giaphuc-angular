import { DanhMucGiaCong } from './danh-muc-gia-cong';
export class DinhMuc {

    public id: number;
    public chinhanh_id: number;
    public kichhoat: boolean;
    public nguoitao_id: number;
    public thoigiantao: Date;
    public nguoisua_id: number;
    public thoigiansua: Date;
    public ghichu: string;
    public madinhmuc: string;
    public tendinhmuc: string;
    public danhmucgiacong_id: number;
    
    public giacong: DanhMucGiaCong;
    public tengiacong: string;

    public dinhmuc_nguyenlieu: DinhMuc_NguyenLieu[];
    public dinhmuc_nguonluc: DinhMuc_NguonLuc[];
    public dinhmuc_chiphikhac: DinhMuc_ChiPhiKhac[];

    constructor(id: number = null, chinhanh_id: number = null, kichhoat: boolean = true, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, madinhmuc: string = null, tendinhmuc: string = null, danhmucgiacong_id: number = null, giacong: DanhMucGiaCong = null, dinhmuc_nguyenlieu: DinhMuc_NguyenLieu[] = null, dinhmuc_nguonluc: DinhMuc_NguonLuc[] = null, dinhmuc_chiphikhac: DinhMuc_ChiPhiKhac[] = null) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.madinhmuc = madinhmuc;
        this.tendinhmuc = tendinhmuc;
        this.danhmucgiacong_id = danhmucgiacong_id;
        
        this.giacong = giacong;
        this.dinhmuc_nguyenlieu = dinhmuc_nguyenlieu;
        this.dinhmuc_nguonluc = dinhmuc_nguonluc;
        this.dinhmuc_chiphikhac = dinhmuc_chiphikhac;
    }
}

export class DinhMuc_NguyenLieu {

    public id: number;
    public nguyenlieu_id: number;
    public dvt_id: number;
    public soluong: number;
    public dongia: number;
    public thanhtien_chiphi: number;
    public loainguyenlieu: string;
    public chuthich: string;
    public tylequydoibandau: number;
    public dinhmuc_id: number;

    public tendonvitinh: string;

    constructor(id: number = null, nguyenlieu_id: number = null, dvt_id: number = null, soluong: number = 1, dongia: number = 0, thanhtien_chiphi: number = 0, loainguyenlieu: string = null, chuthich: string = null, tylequydoibandau: number = null, dinhmuc_id: number = null) {
        this.id = id;
        this.nguyenlieu_id = nguyenlieu_id;
        this.dvt_id = dvt_id;
        this.soluong = soluong;
        this.dongia = dongia;
        this.thanhtien_chiphi = thanhtien_chiphi;
        this.loainguyenlieu = loainguyenlieu;
        this.chuthich = chuthich;
        this.tylequydoibandau = tylequydoibandau;
        this.dinhmuc_id = dinhmuc_id;
    }
}

export class DinhMuc_NguonLuc {

    public id: number;
    public nguonnhanluc_id: number;
    public chiphi: number;
    public chuthich: string;
    public dinhmuc_id: number;

    constructor(id: number = null, nguonnhanluc_id: number = null, chiphi: number = 0, chuthich: string = null, dinhmuc_id: number = null) {
        this.id = id;
        this.nguonnhanluc_id = nguonnhanluc_id;
        this.chiphi = chiphi;
        this.chuthich = chuthich;
        this.dinhmuc_id = dinhmuc_id;
    }
}

export class DinhMuc_ChiPhiKhac {

    public id: number;
    public noidung_id: number;
    public chiphi: number;
    public tinhphi: boolean;
    public chuthich: string;
    public dinhmuc_id: number;

    constructor(id: number = null, noidung_id: number = null, chiphi: number = 0, tinhphi: boolean = false, chuthich: string = null, dinhmuc_id: number = null) {
        this.id = id;
        this.noidung_id = noidung_id;
        this.chiphi = chiphi;
        this.tinhphi = tinhphi;
        this.chuthich = chuthich;
        this.dinhmuc_id = dinhmuc_id;
    }
}