import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//modules
import { FormsModule } from '@angular/forms';

import {
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxDataGridModule,
    DxButtonModule,
    DxDateBoxModule,
    DxTemplateModule,
    DxColorBoxModule,
    DxFormModule,
    DxNumberBoxModule,
    
} from 'devextreme-angular';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,

        DxSelectBoxModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxDataGridModule,
        DxButtonModule,
        DxDateBoxModule,
        DxTemplateModule,
        DxColorBoxModule,
        DxFormModule,
        DxNumberBoxModule
    ],
    exports: [
        CommonModule,
        FormsModule,

        DxSelectBoxModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxDataGridModule,
        DxButtonModule,
        DxDateBoxModule,
        DxTemplateModule,
        DxColorBoxModule,
        DxFormModule,
        DxNumberBoxModule,
    ]
})
export class SharedModule { }