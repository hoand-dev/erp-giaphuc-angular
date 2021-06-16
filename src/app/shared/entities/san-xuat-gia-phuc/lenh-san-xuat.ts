export class LenhSanXuat{

    public lenhsanxuat_chitiets: LenhSanXuat_ChiTiet[];

    public tendonvigiacong : string ;
    public nguoitao_hoten  : string ;
    public nguoisua_hoten  : string ;
    
    public id              : number ;
    public chinhanh_id     : number ;
    public kichhoat        : boolean;
    public nguoitao_id     : number ;
    public thoigiantao     : Date   ;
    public nguoisua_id     : number ;
    public thoigiansua     : Date   ;
    public ghichu          : string ;
    public ids             : number ;
    public sort            : string ;
    public loaiphieu       : string ;
    public ngaysanxuat     : Date   ;
    public malenhsanxuat   : string ;
    public donvigiacong_id : number ;
    public tongthanhtien   : number ;
    public trangthainhap   : string ;


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
        ngaysanxuat     : Date    = new Date(),
        malenhsanxuat   : string  = null      ,
        donvigiacong_id : number  = null      ,
        tongthanhtien   : number  = 0         ,
        trangthainhap   : string  = null      ,
    ){
        this.id              = id             ;
        this.chinhanh_id     = chinhanh_id    ;
        this.kichhoat        = kichhoat       ;
        this.nguoitao_id     = nguoitao_id    ;
        this.thoigiantao     = thoigiantao    ;
        this.nguoisua_id     = nguoisua_id    ;
        this.thoigiansua     = thoigiansua    ;
        this.ghichu          = ghichu         ;
        this.ids             = ids            ;
        this.sort            = sort           ;
        this.loaiphieu       = loaiphieu      ;
        this.ngaysanxuat     = ngaysanxuat    ;
        this.malenhsanxuat   = malenhsanxuat  ;
        this.donvigiacong_id = donvigiacong_id;
        this.tongthanhtien   = tongthanhtien  ;
        this.trangthainhap   = trangthainhap  ;
    }
}

export class LenhSanXuat_ChiTiet{

    public soluongconlai: number = 0;
    
    public id: number;
    public lenhsanxuat_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tilequydoi: number;
    public soluong: number;
    public soluongtattoan: number;
    public soluongdanhap: number;
    public dongia: number;
    public thanhtien: number;
    public chuthich: string;
    public trangthainhap: string;

    constructor(
        id                : number = null,
        lenhsanxuat_id    : number = null,
        loaihanghoa       : string = null,
        hanghoa_id        : number = null,
        hanghoa_lohang_id : number = null,
        dvt_id            : number = null,
        tilequydoi        : number = 1   ,
        soluong           : number = 0   ,
        soluongtattoan    : number = 0   ,
        soluongdanhap     : number = 0   ,
        dongia            : number = 0   ,
        thanhtien         : number = 0   ,
        chuthich          : string = null,
        trangthainhap     : string = null,
    ){
        this.id                = id                ;
        this.lenhsanxuat_id    = lenhsanxuat_id    ;
        this.loaihanghoa       = loaihanghoa       ;
        this.hanghoa_id        = hanghoa_id        ;
        this.hanghoa_lohang_id = hanghoa_lohang_id ;
        this.dvt_id            = dvt_id            ;
        this.tilequydoi        = tilequydoi        ;
        this.soluong           = soluong           ;
        this.soluongtattoan    = soluongtattoan    ;
        this.soluongdanhap     = soluongdanhap     ;
        this.dongia            = dongia            ;
        this.thanhtien         = thanhtien         ;
        this.chuthich          = chuthich          ;
        this.trangthainhap     = trangthainhap     ;
    }
}
