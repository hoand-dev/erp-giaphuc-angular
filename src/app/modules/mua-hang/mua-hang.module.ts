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
import { PhieuMuaHangViewModalComponent } from './modals/phieu-mua-hang-view-modal/phieu-mua-hang-view-modal.component';
import { PhieuTraHangNccViewModalComponent } from './modals/phieu-tra-hang-ncc-view-modal/phieu-tra-hang-ncc-view-modal.component';

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
        PhieuDatHangNCCInPhieuModalComponent,
        PhieuMuaHangViewModalComponent,
        PhieuTraHangNccViewModalComponent
    ],
    imports: [CommonModule, SharedModule, MuaHangRoutingModule]
})
export class MuaHangModule {}
