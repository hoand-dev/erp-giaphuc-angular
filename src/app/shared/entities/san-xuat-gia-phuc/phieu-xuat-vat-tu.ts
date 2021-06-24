export class PhieuXuatVatTu{

    public phieuxuatvattu_chitiets: PhieuXuatVatTu_ChiTiet[];

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
    public ngayxuatvattu  : Date   ;
    public maphieu        : string ;
    public khoxuat_id     : number ;
    public lenhsanxuat_id : number ;

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
        ngayxuatvattu   : Date    = new Date(),
        maphieu         : string  = null      ,
        khoxuat_id      : number  = null      ,
        lenhsanxuat_id  : number  = null      ,
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
        this.ngayxuatvattu   = ngayxuatvattu    ;
        this.maphieu         = maphieu        ;
        this.khoxuat_id      = khoxuat_id     ;
        this.lenhsanxuat_id  = lenhsanxuat_id ;
    }
}

export class PhieuXuatVatTu_ChiTiet{
    public id: number;
    public phieuxuatvattu_id: number;
    public loaihanghoa: string;
    public hanghoa_id: number;
    public hanghoa_lohang_id: number;
    public dvt_id: number;
    public tylequydoi: number;
    public soluong: number;
    public chuthich: string;
    public trangthaixuat;
    
    constructor (

        id  : number = null, 
        phieuxuatvattu_id   : number = null, 
        loaihanghoa : string = null, 
        hanghoa_id  : number = null, 
        hanghoa_lohang_id   : number = null, 
        dvt_id  : number = null, 
        tylequydoi  : number = 1, 
        soluong : number = 0, 
        chuthich    : string = null, 

    ){
        this.id = id ;
        this.phieuxuatvattu_id = phieuxuatvattu_id ;
        this.loaihanghoa = loaihanghoa ;
        this.hanghoa_id = hanghoa_id ;
        this.hanghoa_lohang_id = hanghoa_lohang_id ;
        this.dvt_id = dvt_id ;
        this.tylequydoi = tylequydoi ;
        this.soluong = soluong ;
        this.chuthich = chuthich ;
    }
}