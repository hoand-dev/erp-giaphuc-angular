import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MuaHangRoutingModule } from './mua-hang-routing.module';
import { PhieuMuaHangNCCComponent } from './pages/phieu-mua-hang-ncc/phieu-mua-hang-ncc.component';
import { PhieuMuaHangNCCCapNhatComponent } from './pages/phieu-mua-hang-ncc-cap-nhat/phieu-mua-hang-ncc-cap-nhat.component';
import { PhieuMuaHangNCCThemMoiComponent } from './pages/phieu-mua-hang-ncc-them-moi/phieu-mua-hang-ncc-them-moi.component';
import { PhieuDatHangNCCComponent } from './pages/phieu-dat-hang-ncc/phieu-dat-hang-ncc.component';
import { PhieuDatHangNCCCapNhatComponent } from './pages/phieu-dat-hang-ncc-cap-nhat/phieu-dat-hang-ncc-cap-nhat.component';
import { PhieuDatHangNCCThemMoiComponent } from './pages/phieu-dat-hang-ncc-them-moi/phieu-dat-hang-ncc-them-moi.component';
import { PhieuTraHangNCCThemMoiComponent } from './pages/phieu-tra-hang-ncc-them-moi/phieu-tra-hang-ncc-them-moi.component';
import { PhieuTraHangNCCCapNhatComponent } from './pages/phieu-tra-hang-ncc-cap-nhat/phieu-tra-hang-ncc-cap-nhat.component';
import { PhieuTraHangNCCComponent } from './pages/phieu-tra-hang-ncc/phieu-tra-hang-ncc.component';


@NgModule({
  declarations: [PhieuMuaHangNCCComponent, PhieuMuaHangNCCCapNhatComponent, PhieuMuaHangNCCThemMoiComponent, PhieuDatHangNCCComponent, PhieuDatHangNCCCapNhatComponent, PhieuDatHangNCCThemMoiComponent, PhieuTraHangNCCThemMoiComponent, PhieuTraHangNCCCapNhatComponent, PhieuTraHangNCCComponent],
  imports: [
    CommonModule,
    MuaHangRoutingModule
  ]
})
export class MuaHangModule { }
