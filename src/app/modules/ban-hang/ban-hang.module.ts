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
import { DanhSachHangHoaDatHangThanhPhamComponent } from './modals/danh-sach-hang-hoa-dat-hang-thanh-pham/danh-sach-hang-hoa-dat-hang-thanh-pham.component';
import { BangGiaMelComponent } from './pages/bang-gia-mel/bang-gia-mel.component';
import { BangGiaMelModalComponent } from './modals/bang-gia-mel-modal/bang-gia-mel-modal.component';

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
        PhieuKhachDatHangViewModalComponent,
        DanhSachHangHoaDatHangThanhPhamComponent,
        BangGiaMelComponent,
        BangGiaMelModalComponent
    ],
    imports: [CommonModule, SharedModule, BanHangRoutingModule]
})
export class BanHangModule {}
