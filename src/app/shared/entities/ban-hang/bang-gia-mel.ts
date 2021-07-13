export class BangGiaMel {
    public banggiamel_chitiet: BangGiaMel_ChiTiet[];

    public makhachhang   : string ;
    public tenkhachhang  : string ;
    public nguoitao_hoten: string ;
    public nguoisua_hoten: string ;

    public id            : number ;
    public chinhanh_id   : number ;
    public kichhoat      : boolean;
    public nguoitao_id   : number ;
    public thoigiantao   : Date   ;
    public nguoisua_id   : number ;
    public thoigiansua   : Date   ;
    public ghichu        : string ;
    public ids           : number ;
    public sort          : string ;
    public ngaycohieuluc : Date   ;
    public mabanggia     : string ;
    public khachhang_id  : number ;

    constructor(
        id           : number  = null,
        chinhanh_id  : number  = null,
        kichhoat     : boolean = null,
        nguoitao_id  : number  = null,
        thoigiantao  : Date    = null,
        nguoisua_id  : number  = null,
        thoigiansua  : Date    = null,
        ghichu       : string  = null,
        ids          : number  = null,
        sort         : string  = null,
        ngaycohieuluc: Date    = null,
        mabanggia    : string  = null,
        khachhang_id : number  = null
    ) {
        this.id            = id           ;
        this.chinhanh_id   = chinhanh_id  ;
        this.kichhoat      = kichhoat     ;
        this.nguoitao_id   = nguoitao_id  ;
        this.thoigiantao   = thoigiantao  ;
        this.nguoisua_id   = nguoisua_id  ;
        this.thoigiansua   = thoigiansua  ;
        this.ghichu        = ghichu       ;
        this.ids           = ids          ;
        this.sort          = sort         ;
        this.ngaycohieuluc = ngaycohieuluc;
        this.mabanggia     = mabanggia    ;
        this.khachhang_id  = khachhang_id ;
    }
}

export class BangGiaMel_ChiTiet {

    public id           : number;
    public banggiamel_id: number;
    public giacong_id   : number;
    public dongia_1mat  : number;
    public dongia_2mat  : number;
    public chuthich     : string;

    constructor(
          id           : number = null
        , banggiamel_id: number = null
        , giacong_id   : number = null
        , dongia_1mat  : number = 0
        , dongia_2mat  : number = 0
        , chuthich     : string = null
    ) {
        this.id            = id           ;
        this.banggiamel_id = banggiamel_id;
        this.giacong_id    = giacong_id   ;
        this.dongia_1mat   = dongia_1mat  ;
        this.dongia_2mat   = dongia_2mat  ;
        this.chuthich      = chuthich     ;
    }
}
