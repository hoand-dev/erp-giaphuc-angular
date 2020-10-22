import { Injectable } from '@angular/core';

@Injectable()
export class AppInfoService {
    constructor() { }

    public get title() {
        return 'ERP Hồng Nghi';
    }

    public get currentYear() {
        return new Date().getFullYear();
    }
}