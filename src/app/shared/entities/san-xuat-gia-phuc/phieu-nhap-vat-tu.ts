import { LoHangNhapXuat } from "..";

export class PhieuNhapVatTu{
    
    public phieunhapvattu_chitiets: PhieuNhapVatTu_ChiTiet[];

    public tendonvigiacong   : string ;
    public malenhsanxuat     : string ;
    public tenkhonhap        : string ;
    public nguoitao_hoten    : string ;
    public nguoisua_hoten    : string ;

    public ngaylapphieu: string
    public inphieu_thoigian: string;
    public inphieu_hoten: string;
    public tentaixe: string;
    public lohangnhap: string;
    
    public id             : number ;
    public chinhanh_id    : number ;
    public kichhoat       : boolean;
    public nguoitao_id    : number ;
    public thoigiantao    : Date   ;
    public nguoisua_id    : number ;
    public thoigiansua    : Date   ;
    public ghichu         : string ;
    public ids            : number ;
    public sort           : string ;
    public loaiphieu      : string ;
    public ngaynhapvattu  : Date   ;
    public maphieu        : string ;
    public khonhap_id     : number ;
    public lenhsanxuat_id : number ;
    public donvigiacong_id :number ;
    public khogiacong_id   : number ;

    constructor(
        id              : number  = null      ,
        chinhanh_id     : number  = null      ,
        kichhoat        : boolean = true      ,
        nguoitao_id     : number  = null      ,
        thoigiantao     : Date    = null      ,
        nguoisua_id     : number  = null      ,
        thoigiansua     : Date    = null      ,
        ghichu          : string  = null      ,
        ids             : number  = null      ,
        sort            : string  = null      ,
        loaiphieu       : string  = null      ,
        ngaynhapvattu   : Date    = new Date(),
        maphieu         : string  = null      ,
        khonhap_id      : number  = null      ,
        lenhsanxuat_id  : number  = null      ,
        donvigiacong_id : number  = null      ,
        khogiacong_id   : number  = null      ,
    ){
        this.id              = id              ;
        this.chinhanh_id     = chinhanh_id     ;
        this.kichhoat        = kichhoat        ;
        this.nguoitao_id     = nguoitao_id     ;
        this.thoigiantao     = thoigiantao     ;
        this.nguoisua_id     = nguoisua_id     ;
        this.thoigiansua     = thoigiansua     ;
        this.ghichu          = ghichu          ;
        this.ids             = ids             ;
        this.sort            = sort            ;
        this.loaiphieu       = loaiphieu       ;
        this.ngaynhapvattu   = ngaynhapvattu   ;
        this.maphieu         = maphieu         ;
        this.khonhap_id      = khonhap_id      ;
        this.lenhsanxuat_id  = lenhsanxuat_id  ;
        this.donvigiacong_id = donvigiacong_id ;
        this.khogiacong_id   = khogiacong_id   ;
    }
}

export class PhieuNhapVatTu_ChiTiet{
    public hidden: boolean = true;

    public tendonvitinh: string;
    public tenhanghoa: string;
    public tentiengtrung: string;
    public tenthanhpham: string;
    
    public soluongdinhmuc    : number = 0           ;
    public lohangstr         : string               ;
    public lohangs           : LoHangNhapXuat[] = [];
    public id                : number               ;
    public phieunhapvattu_id : number               ;
    public loaihanghoa       : string               ;
    public hanghoa_id        : number               ;
    public hanghoa_lohang_id : number               ;
    public dvt_id            : number               ;
    public tilequydoi        : number               ;
    public soluong           : number               ;
    public chuthich          : string               ;
    public soluonglo         : number               ;
    public calculate         : boolean              ;
    public lenhsanxuat_chitiet_id : number;
    
    constructor (

        id                : number  = null  ,
        phieunhapvattu_id : number  = null  ,
        loaihanghoa       : string  = null  ,
        hanghoa_id        : number  = null  ,
        hanghoa_lohang_id : number  = null  ,
        dvt_id            : number  = null  ,
        tilequydoi        : number  = 1     ,
        soluong           : number  = 0     ,
        chuthich          : string  = null  ,
        soluonglo         : number  = 0     ,
        calculate         : boolean = false ,
        lenhsanxuat_chitiet_id : number = null ,

    ){
        this.id                = id                ;
        this.phieunhapvattu_id = phieunhapvattu_id ;
        this.loaihanghoa       = loaihanghoa       ;
        this.hanghoa_id        = hanghoa_id        ;
        this.hanghoa_lohang_id = hanghoa_lohang_id ;
        this.dvt_id            = dvt_id            ;
        this.tilequydoi        = tilequydoi        ;
        this.soluong           = soluong           ;
        this.chuthich          = chuthich          ;
        this.soluonglo         = soluonglo         ;
        this.calculate         = calculate         ;
        this.lenhsanxuat_chitiet_id = lenhsanxuat_chitiet_id ;
    }
}