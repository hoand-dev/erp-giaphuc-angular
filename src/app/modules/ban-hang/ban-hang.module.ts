import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanHangRoutingModule } from './ban-hang-routing.module';
import { TheoDoiHopDongComponent } from './pages/theo-doi-hop-dong/theo-doi-hop-dong.component';
import { TheoDoiHopDongThemMoiComponent } from './pages/theo-doi-hop-dong-them-moi/theo-doi-hop-dong-them-moi.component';
import { TheoDoiHopDongCapNhatComponent } from './pages/theo-doi-hop-dong-cap-nhat/theo-doi-hop-dong-cap-nhat.component';
import { SharedModule } from '../shared.module';
import { PhieuDatHangComponent } from './pages/phieu-dat-hang/phieu-dat-hang.component';
import { PhieuDatHangThemMoiComponent } from './pages/phieu-dat-hang-them-moi/phieu-dat-hang-them-moi.component';
import { PhieuDatHangCapNhatComponent } from './pages/phieu-dat-hang-cap-nhat/phieu-dat-hang-cap-nhat.component';
import { DanhSachPhieuDatHangComponent } from './modals/danh-sach-phieu-dat-hang/danh-sach-phieu-dat-hang.component';
import { DanhSachPhieuBanHangComponent } from './modals/danh-sach-phieu-ban-hang/danh-sach-phieu-ban-hang.component';


@NgModule({
  declarations: [TheoDoiHopDongComponent, TheoDoiHopDongThemMoiComponent, TheoDoiHopDongCapNhatComponent, PhieuDatHangComponent, PhieuDatHangThemMoiComponent, PhieuDatHangCapNhatComponent, DanhSachPhieuDatHangComponent, DanhSachPhieuBanHangComponent],
  imports: [
    CommonModule,
    SharedModule,
    BanHangRoutingModule
  ]
})
export class BanHangModule { }
