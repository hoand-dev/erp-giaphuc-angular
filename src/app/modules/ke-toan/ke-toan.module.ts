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


@NgModule({
  declarations: [PhieuChiComponent, PhieuChiThemMoiComponent, PhieuChiCapNhatComponent, PhieuThuComponent, PhieuThuThemMoiComponent, PhieuThuCapNhatComponent],
  imports: [
    CommonModule,
    SharedModule,
    KeToanRoutingModule
  ]
})
export class KeToanModule { }
