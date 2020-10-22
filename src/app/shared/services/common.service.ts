import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor() { }

    isNotEmpty(value: any): boolean {
        return value !== undefined && value !== null && value !== "";
    }
}
