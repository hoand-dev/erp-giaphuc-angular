import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, enableProdMode, Component } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatTabsModule } from '@angular/material/tabs';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/login/login.component';
import { HomeComponent } from '@app/home/home.component';

import { AppInfoService } from '@app/shared/services';

import { ThietLapModule, MuaHangModule, BanHangModule, KhoHangModule, SanXuatModule, ThongKeModule, HeThongModule, SanXuatGiaPhucModule, KeToanModule, SharedModule } from '@app/modules';

/* devextreme localization */
import './shared/localization';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NotFoundComponent, ChangePasswordComponent, NotPermissionComponent } from './shared/components';
import { SumTotalPipe } from './shared/pipes/sum-total.pipe';
import { LoHangNhapXuatModalComponent } from './shared/modals';

@NgModule({
    declarations: [AppComponent, LoginComponent, HomeComponent, NotFoundComponent, ChangePasswordComponent, NotPermissionComponent, LoHangNhapXuatModalComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
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
        HeThongModule,
        SanXuatGiaPhucModule,

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
