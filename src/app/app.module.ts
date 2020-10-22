import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, Component } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextBoxModule,
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

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/login/login.component';
import { HomeComponent } from '@app/home/home.component';
import { NotFoundComponent } from '@app/shared/components/not-found/not-found.component';

import { AppInfoService, CommonService } from '@app/shared/services';
import { 
    ChiNhanhService, 
    DanhMucGiaCongService,
    DanhMucLoiService,
    DanhMucNoService,
    DanhMucTieuChuanService,
    DonViGiaCongService,
    DonViTinhService,
} from '@app/shared/services/thiet-lap';

import { ThietLapModule, MuaHangModule, BanHangModule, SanXuatModule } from '@app/modules';

/* devextreme localization */
import './shared/localization';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        NotFoundComponent
    ],
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
        DxValidatorModule,
        DxValidationSummaryModule,
        DxFormModule,
        DxScrollViewModule,
        DxValidatorModule,
        DxValidationGroupModule,

        ThietLapModule, MuaHangModule, SanXuatModule, BanHangModule,
        AppRoutingModule, // root route phải đặt ở cuối nếu có module con sử dụng route
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider,

        AppInfoService, CommonService, 
        ChiNhanhService, 
        DanhMucGiaCongService,
        DanhMucLoiService,
        DanhMucNoService,
        DanhMucTieuChuanService,
        DonViGiaCongService,
        DonViTinhService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }