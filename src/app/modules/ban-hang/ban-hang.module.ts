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
import { DanhSachPhieuDatHangModalComponent } from './modals/danh-sach-phieu-dat-hang-modal/danh-sach-phieu-dat-hang-modal.component';
import { DanhSachPhieuBanHangModalComponent } from './modals/danh-sach-phieu-ban-hang-modal/danh-sach-phieu-ban-hang-modal.component';
import { PhieuBanHangComponent } from './pages/phieu-ban-hang/phieu-ban-hang.component';
import { PhieuBanHangThemMoiComponent } from './pages/phieu-ban-hang-them-moi/phieu-ban-hang-them-moi.component';
import { PhieuBanHangCapNhatComponent } from './pages/phieu-ban-hang-cap-nhat/phieu-ban-hang-cap-nhat.component';
import { PhieuKhachTraHangComponent } from './pages/phieu-khach-tra-hang/phieu-khach-tra-hang.component';
import { PhieuKhachTraHangThemMoiComponent } from './pages/phieu-khach-tra-hang-them-moi/phieu-khach-tra-hang-them-moi.component';
import { PhieuKhachTraHangCapNhatComponent } from './pages/phieu-khach-tra-hang-cap-nhat/phieu-khach-tra-hang-cap-nhat.component';
import { DanhSachPhieuKhachTraHangModalComponent } from './modals/danh-sach-phieu-khach-tra-hang-modal/danh-sach-phieu-khach-tra-hang-modal.component';

@NgModule({
    declarations: [
        TheoDoiHopDongComponent,
        TheoDoiHopDongThemMoiComponent,
        TheoDoiHopDongCapNhatComponent,
        PhieuDatHangComponent,
        PhieuDatHangThemMoiComponent,
        PhieuDatHangCapNhatComponent,
        DanhSachPhieuDatHangModalComponent,
        DanhSachPhieuBanHangModalComponent,
        PhieuBanHangComponent,
        PhieuBanHangThemMoiComponent,
        PhieuBanHangCapNhatComponent,
        PhieuKhachTraHangComponent,
        PhieuKhachTraHangThemMoiComponent,
        PhieuKhachTraHangCapNhatComponent,
        DanhSachPhieuKhachTraHangModalComponent
    ],
    imports: [CommonModule, SharedModule, BanHangRoutingModule]
})
export class BanHangModule {}
