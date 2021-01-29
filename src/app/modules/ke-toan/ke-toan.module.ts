import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/modules/shared.module';

import { KeToanRoutingModule } from './ke-toan-routing.module';
import {
    PhieuChiCapNhatComponent,
    PhieuChiThemMoiComponent,
    PhieuChiComponent,
    PhieuThuCapNhatComponent,
    PhieuThuThemMoiComponent,
    PhieuThuComponent,
    LenhVayComponent,
    LenhVayCapNhatComponent,
    LenhVayThemMoiComponent,
    PhieuCanTruComponent,
    PhieuCanTruCapNhatComponent,
    PhieuCanTruThemMoiComponent
} from './pages';

import { DanhSachLenhVayModalComponent, PhieuChiInPhieuModalComponent, PhieuThuInPhieuComponent, PhieuCanTruInPhieuModalComponent } from './modals';

@NgModule({
    declarations: [
        PhieuChiComponent,
        PhieuChiThemMoiComponent,
        PhieuChiCapNhatComponent,
        PhieuThuComponent,
        PhieuThuThemMoiComponent,
        PhieuThuCapNhatComponent,
        LenhVayComponent,
        LenhVayCapNhatComponent,
        LenhVayThemMoiComponent,
        PhieuCanTruComponent,
        PhieuCanTruThemMoiComponent,
        PhieuCanTruCapNhatComponent,
        DanhSachLenhVayModalComponent,
        PhieuChiInPhieuModalComponent,
        PhieuThuInPhieuComponent,
        PhieuCanTruInPhieuModalComponent
    ],
    imports: [CommonModule, SharedModule, KeToanRoutingModule]
})
export class KeToanModule {}
