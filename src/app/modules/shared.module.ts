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
    DxTagBoxModule,

 
    
} from 'devextreme-angular';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,

        DxSelectBoxModule,
        DxTagBoxModule,
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

        MatTabsModule
    ],
    exports: [
        CommonModule,
        FormsModule,

        DxSelectBoxModule,
        DxTagBoxModule,
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

        MatTabsModule
    ]
})
export class SharedModule { }