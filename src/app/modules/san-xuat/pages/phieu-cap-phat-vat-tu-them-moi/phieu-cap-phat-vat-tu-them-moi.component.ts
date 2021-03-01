import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-phieu-cap-phat-vat-tu-them-moi',
    templateUrl: './phieu-cap-phat-vat-tu-them-moi.component.html',
    styleUrls: ['./phieu-cap-phat-vat-tu-them-moi.component.css']
})
export class PhieuCapPhatVatTuThemMoiComponent implements OnInit {
    public phieucapphatvattu: any = {
        ngaycapphatvattu: new Date()
    };

    public rules: Object = { X: /[02-9]/ };
    public buttonSubmitOptions: any = {
        text: 'Lưu lại',
        type: 'success',
        useSubmitBehavior: true
    };

    constructor() {}

    ngOnInit(): void {}

    onExit() {}

    onFormSubmit(e) {
        console.log(e);
    }
}
