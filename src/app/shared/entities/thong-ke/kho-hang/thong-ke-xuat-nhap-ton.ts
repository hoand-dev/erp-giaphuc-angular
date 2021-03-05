export class ThongKeXuatNhapTon{
    public loaihanghoa                     : string;
    public mahanghoa                       : string;
    public tenhanghoa                      : string;
    public mavach                          : string;
    public day                             : number;
    public rong                            : number;
    public dai                             : number;
    public m3                              : number;
    public quydoi1                         : number;
    public trongluong                      : number;
    public giatrungbinhhientai             : number;
    public ncc                             : string;
    public tendonvitinh                    : string;
    public tendonvitinhphu                 : string;
    public matieuchuan                     : string;
    public maloaihang                      : string;
    public magiacong                       : string;
    public masomat                         : string;
    public tondauky                        : number;
    public soluong_tonhientai              : number;
    public soluong_khachdat                : number;
    public soluong_banchuaxuat             : number;
    public soluong_giuchuyenkho            : number;
    public soluong_giugiacong              : number;
    public soluong_toncuoiduocxuat         : number;
    public soluongnhap                     : number;
    public soluongxuat                     : number;
    public soluong_dieuchinh               : number;
    public soluong_nhapkho                 : number;
    public soluong_xuatkho                 : number;
    public soluong_xuatchuyen              : number;
    public soluong_nhapchuyen              : number;
    public soluong_xuatgiacong_khoxuat     : number;
    public soluong_xuatgiacong_khogiacong  : number;
    public soluong_nhapgiacong_thanhpham   : number;
    public soluong_nhapgiacong_thanhphamloi: number;
    public soluong_nhapgiacong_hangtron    : number;
    public soluong_nhapgiacong_nguyenlieu  : number;
    public soluong_xuatmuon                : number;
    public soluong_nhapmuon                : number;
    public soluong_xuattramuon             : number;
    public soluong_nhaptramuon             : number;
    public soluong_muachuanhap             : number;
    public soluong_thanhphamchuanhap       : number;
    public toncuoiky                       : number;
    public hanghoa_id                      : number;
    public khohang_id                      : number;
    public makhohang                       : string;
    public tenkhohang                      : string;
}

export class ThongKeXuatNhapTon_ChiTiet{
    public idphieu        : number;
    public ngayphatsinh   : Date  ;
    public maphieu        : string;
    public noidung        : string;
    public khohang        : string;
    public tennhanvien    : string;
    public soluongnhap    : number;
    public soluongxuat    : number;
    public soluongnhapxuat: number;
    public chuthich       : string;
    public ghichu         : string;
    public sort           : string;
    public phieuquery     : string;

    public luytien        : number;
}

// -- chi tiết khách đặt giữ hàng
// -- chi tiết bán chưa xuất
// -- chi tiết giữ gia công
// -- chi tiết giữ chuyển kho
// -- chi tiết mua chưa nhập
// -- chi tiết gia công chưa nhập
export class ThongKeXuatNhapTon_ChiTietPhieu{
    public idphieu     : number;
    public ngayphatsinh: Date  ;
    public maphieu     : string;
    public diendai     : string;
    public tenkhohang  : string;
    public loaihanghoa : string;
    public mahanghoa   : string;
    public tendonvitinh: string;
    public soluong     : number;
    public chuthich    : string;
}
