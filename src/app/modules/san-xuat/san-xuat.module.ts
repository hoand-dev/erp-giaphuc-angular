import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';

import { SanXuatRoutingModule } from './san-xuat-routing.module';

import {
    BangGiaGiaCongCapNhatComponent,
    BangGiaGiaCongThemMoiComponent,
    BangGiaGiaCongComponent,
    PhieuCapPhatVatTuCapNhatComponent,
    PhieuCapPhatVatTuThemMoiComponent,
    PhieuCapPhatVatTuComponent,
    PhieuXuatKhoGiaCongCapNhatComponent,
    PhieuXuatKhoGiaCongThemMoiComponent,
    PhieuXuatKhoGiaCongComponent,
    PhieuYeuCauGiaCongCapNhatComponent,
    PhieuYeuCauGiaCongThemMoiComponent,
    PhieuYeuCauGiaCongComponent,
    PhieuNhapKhoGiaCongComponent,
    PhieuNhapKhoGiaCongThemMoiComponent,
    PhieuNhapKhoGiaCongCapNhatComponent
} from './pages';

import {
    DanhSachHangHoaYeuCauGiaCongModalComponent,
    DanhSachPhieuYeuCauGiaCongModalComponent,
    DanhSachLoiModalComponent,
    PhieuXuatKhoGiaCongInPhieuModalComponent,
    PhieuYeuCauGiaCongInPhieuModalComponent,
    PhieuNhapThanhPhamInPhieuModalComponent
} from './modals';

@NgModule({
    declarations: [
        PhieuCapPhatVatTuComponent,
        PhieuCapPhatVatTuThemMoiComponent,
        PhieuCapPhatVatTuCapNhatComponent,
        BangGiaGiaCongComponent,
        BangGiaGiaCongThemMoiComponent,
        BangGiaGiaCongCapNhatComponent,
        PhieuXuatKhoGiaCongComponent,
        PhieuXuatKhoGiaCongThemMoiComponent,
        PhieuXuatKhoGiaCongCapNhatComponent,
        DanhSachHangHoaYeuCauGiaCongModalComponent,
        PhieuYeuCauGiaCongComponent,
        PhieuYeuCauGiaCongThemMoiComponent,
        PhieuYeuCauGiaCongCapNhatComponent,
        PhieuNhapKhoGiaCongComponent,
        PhieuNhapKhoGiaCongThemMoiComponent,
        PhieuNhapKhoGiaCongCapNhatComponent,
        DanhSachPhieuYeuCauGiaCongModalComponent,
        DanhSachLoiModalComponent,
        PhieuXuatKhoGiaCongInPhieuModalComponent,
        PhieuYeuCauGiaCongInPhieuModalComponent,
        PhieuNhapThanhPhamInPhieuModalComponent
    ],
    imports: [CommonModule, SharedModule, SanXuatRoutingModule]
})
export class SanXuatModule {}
