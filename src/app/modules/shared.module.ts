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
    DxDropDownBoxModule,
    DxPopupModule,
    DxScrollViewModule,
    DxListModule,
    DxLoadPanelModule
} from 'devextreme-angular';
import { MatTabsModule } from '@angular/material/tabs';
import { SumTotalPipe } from '@app/shared/pipes/sum-total.pipe';

@NgModule({
    declarations: [SumTotalPipe],
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
        DxDropDownBoxModule,
        DxPopupModule,
        DxScrollViewModule,
        DxListModule,
        DxLoadPanelModule,
        MatTabsModule
    ],
    exports: [
        SumTotalPipe,
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
        DxDropDownBoxModule,
        DxPopupModule,
        DxScrollViewModule,
        DxListModule,
        DxLoadPanelModule,
        MatTabsModule
    ]
})
export class SharedModule {}
