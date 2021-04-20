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
import { PhieuThuViewModalComponent } from './modals/phieu-thu-view-modal/phieu-thu-view-modal.component';
import { PhieuChiViewModalComponent } from './modals/phieu-chi-view-modal/phieu-chi-view-modal.component';

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
        PhieuCanTruInPhieuModalComponent,
        PhieuThuViewModalComponent,
        PhieuChiViewModalComponent
    ],
    imports: [CommonModule, SharedModule, KeToanRoutingModule]
})
export class KeToanModule {}
