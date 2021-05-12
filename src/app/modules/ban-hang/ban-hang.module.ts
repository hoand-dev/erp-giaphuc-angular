import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';

import { BanHangRoutingModule } from './ban-hang-routing.module';
import {
    BangGiaCapNhatComponent,
    BangGiaThemMoiComponent,
    BangGiaComponent,
    PhieuBanHangCapNhatComponent,
    PhieuBanHangThemMoiComponent,
    PhieuBanHangComponent,
    PhieuDatHangCapNhatComponent,
    PhieuDatHangThemMoiComponent,
    PhieuDatHangComponent,
    PhieuKhachTraHangCapNhatComponent,
    PhieuKhachTraHangThemMoiComponent,
    PhieuKhachTraHangComponent,
    TheoDoiHopDongCapNhatComponent,
    TheoDoiHopDongThemMoiComponent,
    TheoDoiHopDongComponent
} from './pages';

import {
    DanhSachPhieuDatHangModalComponent,
    DanhSachPhieuBanHangModalComponent,
    DanhSachPhieuKhachTraHangModalComponent,
    PhieuKhachDatHangInPhieuModalComponent,
    PhieuBanHangInPhieuComponent
} from './modals';
import { PhieuBanHangViewModalComponent } from './modals/phieu-ban-hang-view-modal/phieu-ban-hang-view-modal.component';
import { PhieuKhachTraHangViewModalComponent } from './modals/phieu-khach-tra-hang-view-modal/phieu-khach-tra-hang-view-modal.component';
import { PhieuKhachDatHangViewModalComponent } from './modals/phieu-khach-dat-hang-view-modal/phieu-khach-dat-hang-view-modal.component';

@NgModule({
    declarations: [
        DanhSachPhieuDatHangModalComponent,
        DanhSachPhieuBanHangModalComponent,
        DanhSachPhieuKhachTraHangModalComponent,
        TheoDoiHopDongComponent,
        TheoDoiHopDongThemMoiComponent,
        TheoDoiHopDongCapNhatComponent,
        PhieuDatHangComponent,
        PhieuDatHangThemMoiComponent,
        PhieuDatHangCapNhatComponent,
        PhieuBanHangComponent,
        PhieuBanHangThemMoiComponent,
        PhieuBanHangCapNhatComponent,
        PhieuKhachTraHangComponent,
        PhieuKhachTraHangThemMoiComponent,
        PhieuKhachTraHangCapNhatComponent,
        BangGiaComponent,
        BangGiaThemMoiComponent,
        BangGiaCapNhatComponent,
        PhieuKhachDatHangInPhieuModalComponent,
        PhieuBanHangInPhieuComponent,
        PhieuBanHangViewModalComponent,
        PhieuKhachTraHangViewModalComponent,
        PhieuKhachDatHangViewModalComponent
    ],
    imports: [CommonModule, SharedModule, BanHangRoutingModule]
})
export class BanHangModule {}
