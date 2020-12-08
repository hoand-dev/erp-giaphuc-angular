import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KeToanRoutingModule } from './ke-toan-routing.module';
import { PhieuChiComponent } from './pages/phieu-chi/phieu-chi.component';
import { PhieuChiThemMoiComponent } from './pages/phieu-chi-them-moi/phieu-chi-them-moi.component';
import { PhieuChiCapNhatComponent } from './pages/phieu-chi-cap-nhat/phieu-chi-cap-nhat.component';


@NgModule({
  declarations: [PhieuChiComponent, PhieuChiThemMoiComponent, PhieuChiCapNhatComponent],
  imports: [
    CommonModule,
    KeToanRoutingModule
  ]
})
export class KeToanModule { }
