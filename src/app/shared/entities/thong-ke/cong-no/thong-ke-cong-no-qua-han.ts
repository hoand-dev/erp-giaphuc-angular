export class ThongKeCongNoQuaHan{
    public tenkhachhang: string;
    public ngaylap: Date;
    public chungtu: string;
    public tongthanhtien: number;
    public ngaydenhan: Date;
    public quahan0115:number;
    public quahan1630:number;
    public quahan3145:number;
    public quahan4660:number;
    public quahan61:number;

    public tongtien:number;

    constructor(
        tongtien: number = 0
    ){
        this.tongtien = tongtien
    }
}