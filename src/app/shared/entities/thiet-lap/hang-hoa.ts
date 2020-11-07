import { DanhMucTieuChuan } from './danh-muc-tieu-chuan';
import { LoaiHang } from './loai-hang';
import { DonViTinh } from './don-vi-tinh';
import { SoMat } from './so-mat';
import { DanhMucGiaCong } from './danh-muc-gia-cong';
import { DinhMuc } from './dinh-muc';

export class HangHoa {

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
    public trongluong: number;
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
    public tengiacong: string;

    public somat: SoMat;
    public tensomat: string;

    public tieuchuan: DanhMucTieuChuan;
    public tentieuchuan: string;
    
    public loaihang: LoaiHang;
    public tenloaihang: string;

    public donvitinh: DonViTinh;
    public tendonvitinh: string;

    public donvitinhphu: DonViTinh;
    public tendonvitinhphu: string;    

    constructor(id: number = null, chinhanh_id: number = null, kichhoat: boolean = true, nguoitao_id: number = null, thoigiantao: Date = null, nguoisua_id: number = null, thoigiansua: Date = null, ghichu: string = null, loaihanghoa: string = null, mahanghoa: string = null, tenhanghoa: string = null, mavach: string = null, tieuchuan_id: number = null, loaihang_id: number = null, day: number = 0, dai: number = 0, rong: number = 0, m3: number = 0, dvt_id: number = null, dvt1_id: number = null, quydoi1: number = 1, gianhap: number = 0, giabanle: number = null, giabansi: number = null, trongluong: number = 0, dinhmucton: number = 0, giatrungbinhhientai: number = null, dinhmuctonduoi: number = null, dinhmuctontren: number = null, somat_id: number = null, chietkhaumua: number = null, chietkhauban: number = null, thuevatmua: number = null, thuevatban: number = null, nhacungcap_id: number = null, ncc: string = null, gianhap1: number = null, giabanle1: number = null, giabansi1: number = null, dinhmuc_id: number = null, donvitinh: DonViTinh = null, donvitinhphu: DonViTinh = null, tieuchuan: DanhMucTieuChuan = null, loaihang: LoaiHang = null, somat: SoMat = null) {
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

        this.tieuchuan = tieuchuan;
        this.loaihang = loaihang;
        this.somat = somat;

        this.donvitinh = donvitinh;
        this.donvitinhphu = donvitinhphu;
    }
}