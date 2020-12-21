import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/modules/shared.module';

import { KeToanRoutingModule } from './ke-toan-routing.module';
import { PhieuChiComponent } from './pages/phieu-chi/phieu-chi.component';
import { PhieuChiThemMoiComponent } from './pages/phieu-chi-them-moi/phieu-chi-them-moi.component';
import { PhieuChiCapNhatComponent } from './pages/phieu-chi-cap-nhat/phieu-chi-cap-nhat.component';
import { PhieuThuComponent } from './pages/phieu-thu/phieu-thu.component';
import { PhieuThuThemMoiComponent } from './pages/phieu-thu-them-moi/phieu-thu-them-moi.component';
import { PhieuThuCapNhatComponent } from './pages/phieu-thu-cap-nhat/phieu-thu-cap-nhat.component';
import { LenhVayComponent } from './pages/lenh-vay/lenh-vay.component';
import { LenhVayCapNhatComponent } from './pages/lenh-vay-cap-nhat/lenh-vay-cap-nhat.component';
import { LenhVayThemMoiComponent } from './pages/lenh-vay-them-moi/lenh-vay-them-moi.component';
import { PhieuCanTruComponent } from './pages/phieu-can-tru/phieu-can-tru.component';
import { PhieuCanTruThemMoiComponent } from './pages/phieu-can-tru-them-moi/phieu-can-tru-them-moi.component';
import { PhieuCanTruCapNhatComponent } from './pages/phieu-can-tru-cap-nhat/phieu-can-tru-cap-nhat.component';
import { DanhSachLenhVayModalComponent } from './modals/danh-sach-lenh-vay/danh-sach-lenh-vay-modal.component';

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
        DanhSachLenhVayModalComponent
    ],
    imports: [CommonModule, SharedModule, KeToanRoutingModule]
})
export class KeToanModule {}
