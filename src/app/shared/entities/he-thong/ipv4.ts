export class Ipv4 {
    public nguoitao_hoten: string;
    public nguoisua_hoten: string;
    
    public id         : number ;
    public chinhanh_id: number ;
    public kichhoat   : boolean;
    public nguoitao_id: number ;
    public thoigiantao: Date   ;
    public nguoisua_id: number ;
    public thoigiansua: Date   ;
    public ipv4       : string ;
    public ghichu     : string ;

    constructor(
        id         : number  = null,
        chinhanh_id: number  = null,
        kichhoat   : boolean = true,
        nguoitao_id: number  = null,
        thoigiantao: Date    = null,
        nguoisua_id: number  = null,
        thoigiansua: Date    = null,
        ipv4       : string  = null,
        ghichu     : string  = null
    ) {
        this.id          = id         ;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat    = kichhoat   ;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ipv4        = ipv4       ;
        this.ghichu      = ghichu     ;
    }
}
