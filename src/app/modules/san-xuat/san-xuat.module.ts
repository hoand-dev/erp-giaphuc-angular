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
import { PhieuYeuCauGiaCongViewModalComponent } from './modals/phieu-yeu-cau-gia-cong-view-modal/phieu-yeu-cau-gia-cong-view-modal.component';
import { PhieuXuatKhoGiaCongViewModalComponent } from './modals/phieu-xuat-kho-gia-cong-view-modal/phieu-xuat-kho-gia-cong-view-modal.component';
import { PhieuNhapNhapThanhPhamViewModalComponent } from './modals/phieu-nhap-nhap-thanh-pham-view-modal/phieu-nhap-nhap-thanh-pham-view-modal.component';
import { DanhSachChiPhiModalComponent } from './modals/danh-sach-chi-phi-modal/danh-sach-chi-phi-modal.component';

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
        PhieuNhapThanhPhamInPhieuModalComponent,
        PhieuYeuCauGiaCongViewModalComponent,
        PhieuXuatKhoGiaCongViewModalComponent,
        PhieuNhapNhapThanhPhamViewModalComponent,
        DanhSachChiPhiModalComponent
    ],
    imports: [CommonModule, SharedModule, SanXuatRoutingModule]
})
export class SanXuatModule {}
