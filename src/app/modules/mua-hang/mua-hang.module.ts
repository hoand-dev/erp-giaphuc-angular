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
import { DanhSachPhieuDatHangNCCModalComponent } from './modals/danh-sach-phieu-dat-hang-ncc-modal/danh-sach-phieu-dat-hang-ncc-modal.component';
import { DanhSachPhieuMuaHangNCCModalComponent } from './modals/danh-sach-phieu-mua-hang-ncc-modal/danh-sach-phieu-mua-hang-ncc-modal.component';
import { DanhSachPhieuTraHangNCCModalComponent } from './modals/danh-sach-phieu-tra-hang-ncc-modal/danh-sach-phieu-tra-hang-ncc-modal.component';

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
        DanhSachPhieuTraHangNCCModalComponent
    ],
    imports: [CommonModule, SharedModule, MuaHangRoutingModule]
})
export class MuaHangModule {}
