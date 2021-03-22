import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, Component } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxValidatorModule,
    DxFormModule,
    DxValidationSummaryModule,
    DxDataGridModule,
    DxButtonModule,
    DxDateBoxModule,
    DxTagBoxModule,
    DxTemplateModule,
    DxScrollViewModule,
    DxValidationGroupModule
} from 'devextreme-angular';
import { MatTabsModule } from '@angular/material/tabs';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/login/login.component';
import { HomeComponent } from '@app/home/home.component';
import { NotFoundComponent } from '@app/shared/components/not-found/not-found.component';

import { AppInfoService } from '@app/shared/services';

import { ThietLapModule, MuaHangModule, BanHangModule, KhoHangModule, SanXuatModule, ThongKeModule } from '@app/modules';

/* devextreme localization */
import './shared/localization';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalModule } from 'ngx-bootstrap/modal';
import { KeToanModule } from './modules/ke-toan/ke-toan.module';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { NotPermissionComponent } from './shared/components/not-permission/not-permission.component';
import { SumTotalPipe } from './shared/pipes/sum-total.pipe';

@NgModule({
    declarations: [AppComponent, LoginComponent, HomeComponent, NotFoundComponent, ChangePasswordComponent, NotPermissionComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,

        DxTagBoxModule,
        DxDataGridModule,
        DxTemplateModule,
        DxDateBoxModule,
        DxButtonModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxTextAreaModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxFormModule,
        DxScrollViewModule,
        DxValidatorModule,
        DxValidationGroupModule,

        MatTabsModule,
        ModalModule.forRoot(),
        BrowserAnimationsModule,

        ThietLapModule,
        MuaHangModule,
        SanXuatModule,
        BanHangModule,
        KhoHangModule,
        KeToanModule,
        ThongKeModule,

        AppRoutingModule // root route phải đặt ở cuối nếu có module con sử dụng route
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider,

        AppInfoService, SumTotalPipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
