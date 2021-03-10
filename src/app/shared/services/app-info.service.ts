import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
    constructor() {}

    public appName: string = 'ERP HỒNG NGHI';

    public get title() {
        return this.appName;
    }

    public get currentYear() {
        return new Date().getFullYear();
    }

    /* danh sách loại hàng hóa cho bảng hàng hóa */
    public get loaihanghoa_nguyenlieu() {
        return 'nguyenlieu';
    }

    public get loaihanghoa_hangtron() {
        return 'hangtron';
    }

    public get loaihanghoa_thanhpham() {
        return 'thanhpham';
    }
}
