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
 
    ],
    imports: [CommonModule, SharedModule, BanHangRoutingModule]
})
export class BanHangModule {}
