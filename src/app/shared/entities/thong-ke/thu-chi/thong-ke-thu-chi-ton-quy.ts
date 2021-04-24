export class ThongKeThuChiTonQuy{
    public maquy: string;
    public tenquy: string;
    public sotaikhoan: string;
    public tainganhang: string;
    public quy_id: number;
    
    public ngayphatsinh: Date;
    public maphieu: string;
    public nguoinopnhan: string;
    public sotienthu: number;
    public sotiengiamthu: number;
    public sotienchi: number;
    public sotiengiamchi: number;
    public ghichu: string;
    
    public nhanvien: string;
    
    public phieu: string;
    public noidung: string;

    public tonquyhientai: number;
	public tondauky: number;
	public toncuoiky: number;
}

export class ThongKeThuChiTonQuy_ChiTietPhieu{
    public idphieu     : number;
    public ngayphatsinh: Date;
    public maphieu: string;
    public noidung: string;
    public ghichu: string;
    public nhanvien: string;
    
    public tonquyhientai: number;
    public tondauky: number;
    public sotienthu: number;
    public sotiengiamthu: number;
    public sotienchi: number;
    public sotiengiamchi: number;
    public toncuoiky: number;

    public luytien: number;
    public phieuquery:string;

    public nguoinopnhan:string;
    public tenquy: string;
}