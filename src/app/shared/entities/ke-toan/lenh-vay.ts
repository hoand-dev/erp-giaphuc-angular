export class LenhVay {

    public tenquynhan: string;
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
    public ids: number;
    public sort: string;
    public ngayvay: Date;
    public malenhvay: string;
    public quynhan_id: number;
    public ngayhethan: Date;
    public sotienvay: number;
    public laixuat: number;
    public sotiendachi: number;
    public sotiendachi_laixuat: number;
    public trangthaichi: string;

    constructor(
        id: number = null,
        chinhanh_id: number = null,
        kichhoat: boolean = true,
        nguoitao_id: number = null,
        thoigiantao: Date = null,
        nguoisua_id: number = null,
        thoigiansua: Date = null,
        ghichu: string = null,
        ids: number = null,
        sort: string = null,
        ngayvay: Date = new Date(),
        malenhvay: string = null,
        quynhan_id: number = null,
        ngayhethan: Date = null,
        sotienvay: number = 0,
        laixuat: number = 0,
        sotiendachi: number = 0,
        sotiendachi_laixuat: number = 0,
        trangthaichi: string = null
    ) {
        this.id = id;
        this.chinhanh_id = chinhanh_id;
        this.kichhoat = kichhoat;
        this.nguoitao_id = nguoitao_id;
        this.thoigiantao = thoigiantao;
        this.nguoisua_id = nguoisua_id;
        this.thoigiansua = thoigiansua;
        this.ghichu = ghichu;
        this.ids = ids;
        this.sort = sort;
        this.ngayvay = ngayvay;
        this.malenhvay = malenhvay;
        this.quynhan_id = quynhan_id;
        this.ngayhethan = ngayhethan;
        this.sotienvay = sotienvay;
        this.laixuat = laixuat;
        this.sotiendachi = sotiendachi;
        this.sotiendachi_laixuat = sotiendachi_laixuat;
        this.trangthaichi = trangthaichi;
    }
}
