import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';
import { MuaHangRoutingModule } from './mua-hang-routing.module';

import {
    PhieuMuaHangNCCComponent,
    PhieuMuaHangNCCCapNhatComponent,
    PhieuMuaHangNCCThemMoiComponent,
    PhieuDatHangNCCComponent,
    PhieuDatHangNCCCapNhatComponent,
    PhieuDatHangNCCThemMoiComponent,
    PhieuTraHangNCCComponent,
    PhieuTraHangNCCCapNhatComponent,
    PhieuTraHangNCCThemMoiComponent
} from './pages';

import { DanhSachPhieuDatHangNCCModalComponent, DanhSachPhieuMuaHangNCCModalComponent, DanhSachPhieuTraHangNCCModalComponent, PhieuDatHangNCCInPhieuModalComponent } from './modals';

@NgModule({
    declarations: [
        PhieuMuaHangNCCComponent,
        PhieuMuaHangNCCCapNhatComponent,
        PhieuMuaHangNCCThemMoiComponent,
        PhieuDatHangNCCComponent,
        PhieuDatHangNCCCapNhatComponent,
        PhieuDatHangNCCThemMoiComponent,
        PhieuTraHangNCCComponent,
        PhieuTraHangNCCCapNhatComponent,
        PhieuTraHangNCCThemMoiComponent,
        DanhSachPhieuDatHangNCCModalComponent,
        DanhSachPhieuMuaHangNCCModalComponent,
        DanhSachPhieuTraHangNCCModalComponent,
        PhieuDatHangNCCInPhieuModalComponent
    ],
    imports: [CommonModule, SharedModule, MuaHangRoutingModule]
})
export class MuaHangModule {}
