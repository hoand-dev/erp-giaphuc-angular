import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';
import { HeThongRoutingModule } from './he-thong-routing.module';

import { LichSuComponent } from './pages/lich-su/lich-su.component';
import { Ipv4Component } from './pages/ipv4/ipv4.component';
import { Ipv4ModalComponent } from './modals/ipv4-modal/ipv4-modal.component';
import { TrangThaiHoatDongComponent } from './pages/trang-thai-hoat-dong/trang-thai-hoat-dong.component';

@NgModule({
    declarations: [LichSuComponent, Ipv4Component, Ipv4ModalComponent, TrangThaiHoatDongComponent],
    imports: [CommonModule, SharedModule, HeThongRoutingModule]
})
export class HeThongModule {}
