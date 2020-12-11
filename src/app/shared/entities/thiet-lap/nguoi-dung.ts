export class NguoiDung {
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
    public avatar: string;
    public username: string;
    public password: string;
    public hoten: string;
    public ngaysinh: Date;
    public gioitinh: boolean;
    public cmnd: string;
    public dienthoai: string;
    public email: string;
    public diachi: string;
    public login_chinhanh: boolean;
    public sys: boolean;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = null,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        avatar: string = null,
        username: string = null,
        password: string = null,
        hoten: string = null,
        ngaysinh: Date = null,
        gioitinh: boolean = null,
        cmnd: string = null,
        dienthoai: string = null,
        email: string = null,
        diachi: string = null,
        login_chinhanh: boolean = null,
        sys: boolean = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.avatar = avatar;
        this.username = username;
        this.password = password;
        this.hoten = hoten;
        this.ngaysinh = ngaysinh;
        this.gioitinh = gioitinh;
        this.cmnd = cmnd;
        this.dienthoai = dienthoai;
        this.email = email;
        this.diachi = diachi;
        this.login_chinhanh = login_chinhanh;
        this.sys = sys;
    }
}
