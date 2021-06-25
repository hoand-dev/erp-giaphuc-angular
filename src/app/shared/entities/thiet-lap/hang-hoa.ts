import { DinhMuc } from './dinh-muc';

export class HangHoa {
    
    public hanghoadvts: HangHoaDonViTinh[] = [];

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
    public loaihanghoa: string;
    public mahanghoa: string;
    public tenhanghoa: string;
    public mavach: string;
    public tieuchuan_id: number;
    public loaihang_id: number;
    public day: number;
    public dai: number;
    public rong: number;
    public m3: number;
    public dvt_id: number;
    public dvt1_id: number;
    public quydoi1: number;
    public gianhap: number;
    public giabanle: number;
    public giabansi: number;
    public trongluong: number = 0;
    public dinhmucton: number;
    public giatrungbinhhientai: number;
    public dinhmuctonduoi: number;
    public dinhmuctontren: number;
    public somat_id: number;
    public chietkhaumua: number;
    public chietkhauban: number;
    public thuevatmua: number;
    public thuevatban: number;
    public nhacungcap_id: number;
    public ncc: string;
    public gianhap1: number;
    public giabanle1: number;
    public giabansi1: number;
    public dinhmuc_id: number;

    public dinhmuc_giacong: DinhMuc[];
    public idgiacongs: string;
    public magiacong: string;
    public tengiacong: string;

    public masomat: string;
    public tensomat: string;

    public matieuchuan: string;
    public tentieuchuan: string;
    
    public maloaihang: string;
    public tenloaihang: string;

    public tendonvitinh: string;
    public tendonvitinhphu: string;

    public soluong_tonhientai: number;
    public soluong_tonduocxuat: number;

    public loi_id: number;
    public tiengtrung: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        loaihanghoa: string = null,
        mahanghoa: string = null,
        tenhanghoa: string = null,
        mavach: string = null,
        tieuchuan_id: number = null,
        loaihang_id: number = null,
        day: number = 0,
        dai: number = 0,
        rong: number = 0,
        m3: number = 0,
        dvt_id: number = null,
        dvt1_id: number = null,
        quydoi1: number = 0,
        gianhap: number = 0,
        giabanle: number = null,
        giabansi: number = null,
        trongluong: number = 0,
        dinhmucton: number = 0,
        giatrungbinhhientai: number = null,
        dinhmuctonduoi: number = null,
        dinhmuctontren: number = null,
        somat_id: number = null,
        chietkhaumua: number = null,
        chietkhauban: number = null,
        thuevatmua: number = null,
        thuevatban: number = null,
        nhacungcap_id: number = null,
        ncc: string = null,
        gianhap1: number = null,
        giabanle1: number = null,
        giabansi1: number = null,
        dinhmuc_id: number = null,
        loi_id: number = null,
        tiengtrung: string = null,
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.loaihanghoa = loaihanghoa;
        this.mahanghoa = mahanghoa;
        this.tenhanghoa = tenhanghoa;
        this.mavach = mavach;
        this.tieuchuan_id = tieuchuan_id;
        this.loaihang_id = loaihang_id;
        this.day = day;
        this.dai = dai;
        this.rong = rong;
        this.m3 = m3;
        this.dvt_id = dvt_id;
        this.dvt1_id = dvt1_id;
        this.quydoi1 = quydoi1;
        this.gianhap = gianhap;
        this.giabanle = giabanle;
        this.giabansi = giabansi;
        this.trongluong = trongluong;
        this.dinhmucton = dinhmucton;
        this.giatrungbinhhientai = giatrungbinhhientai;
        this.dinhmuctonduoi = dinhmuctonduoi;
        this.dinhmuctontren = dinhmuctontren;
        this.somat_id = somat_id;
        this.chietkhaumua = chietkhaumua;
        this.chietkhauban = chietkhauban;
        this.thuevatmua = thuevatmua;
        this.thuevatban = thuevatban;
        this.nhacungcap_id = nhacungcap_id;
        this.ncc = ncc;
        this.gianhap1 = gianhap1;
        this.giabanle1 = giabanle1;
        this.giabansi1 = giabansi1;
        this.dinhmuc_id = dinhmuc_id;
        this.loi_id = loi_id;
        this.tiengtrung = tiengtrung;
    }
}

export class HangHoaDonViTinh{

    public madonvitinh     : string ;
    public tendonvitinh    : string ;

    public hanghoa_id      : number ;
    public dvt_id          : number ;
    public chuyendoi       : number ;
    public congthuc        : string ;
    public mota            : string ;
    public allow_chuyendoi : boolean;

    constructor(
        hanghoa_id     : number  = null ,
        dvt_id         : number  = null ,
        chuyendoi      : number  = 1    ,
        congthuc       : string  = '*'  ,
        mota           : string  = null ,
        allow_chuyendoi: boolean = false,
    ){
        this.hanghoa_id      = hanghoa_id     ;
        this.dvt_id          = dvt_id         ;
        this.chuyendoi       = chuyendoi      ;
        this.congthuc        = congthuc       ;
        this.mota            = mota           ;
        this.allow_chuyendoi = allow_chuyendoi;
    }
}

export class HangHoa_LoHang{

    public maphieu                : string ;
    
    public id                     : number ;
    public chinhanh_id            : number ;
    public kichhoat               : boolean;
    public nguoitao_id            : number ;
    public ngaytao                : Date   ;
    public nguoisua_id            : number ;
    public ngaysua                : Date   ;
    public hanghoa_id             : number ;
    public loaihanghoa            : string ;
    public hanghoa                : boolean;
    public malohang               : string ;
    public hansudung              : Date   ;
    public phieunhapthanhpham_id  : number ;
    public phieunhapkho_id        : number ;
    public ngaynhapkho            : Date   ;
    public nhacungcap_id          : number ;
    public phieunhapkhogiacong_id : number ;

    constructor(
        id                     : number  = null,
        chinhanh_id            : number  = null,
        kichhoat               : boolean = null,
        nguoitao_id            : number  = null,
        ngaytao                : Date    = null,
        nguoisua_id            : number  = null,
        ngaysua                : Date    = null,
        hanghoa_id             : number  = null,
        loaihanghoa            : string  = null,
        hanghoa                : boolean = null,
        malohang               : string  = null,
        hansudung              : Date    = null,
        phieunhapthanhpham_id  : number  = null,
        phieunhapkho_id        : number  = null,
        ngaynhapkho            : Date    = null,
        nhacungcap_id          : number  = null,
        phieunhapkhogiacong_id : number  = null,
    ){
        this.id                     = id                     ;
        this.chinhanh_id            = chinhanh_id            ;
        this.kichhoat               = kichhoat               ;
        this.nguoitao_id            = nguoitao_id            ;
        this.ngaytao                = ngaytao                ;
        this.nguoisua_id            = nguoisua_id            ;
        this.ngaysua                = ngaysua                ;
        this.hanghoa_id             = hanghoa_id             ;
        this.loaihanghoa            = loaihanghoa            ;
        this.hanghoa                = hanghoa                ;
        this.malohang               = malohang               ;
        this.hansudung              = hansudung              ;
        this.phieunhapthanhpham_id  = phieunhapthanhpham_id  ;
        this.phieunhapkho_id        = phieunhapkho_id        ;
        this.ngaynhapkho            = ngaynhapkho            ;
        this.nhacungcap_id          = nhacungcap_id          ;
        this.phieunhapkhogiacong_id = phieunhapkhogiacong_id ;
    }
}

export class LoHangNhapXuat {

    public hanghoa_lohang_id: number;
    public hanghoa_id       : number;
    public malohang         : string;
    public hansudung        : string;
    public soluong          : number;
    public chitiet_id       : number;

    constructor(
          hanghoa_lohang_id: number = null
        , hanghoa_id       : number = null
        , malohang         : string = null
        , hansudung        : string = null
        , soluong          : number = 0
        , chitiet_id       : number = null
    ) {
        this.hanghoa_lohang_id = hanghoa_lohang_id;
        this.hanghoa_id        = hanghoa_id       ;
        this.malohang          = malohang         ;
        this.hansudung         = hansudung        ;
        this.soluong           = soluong          ;
        this.chitiet_id        = chitiet_id       ;
    }
}
