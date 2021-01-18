import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KhoHangRoutingModule } from './kho-hang-routing.module';
import { SharedModule } from '../shared.module';

import {
    PhieuNhapKhoComponent,
    PhieuNhapKhoCapNhatComponent,
    PhieuNhapKhoThemMoiComponent,
    PhieuXuatKhoComponent,
    PhieuXuatKhoThemMoiComponent,
    PhieuXuatKhoCapNhatComponent,
    PhieuXuatChuyenKhoComponent,
    PhieuXuatChuyenKhoThemMoiComponent,
    PhieuXuatChuyenKhoCapNhatComponent,
    PhieuDieuChinhKhoComponent,
    PhieuDieuChinhKhoCapNhatComponent,
    PhieuDieuChinhKhoThemMoiComponent,
    PhieuNhapChuyenKhoComponent,
    PhieuNhapChuyenKhoThemMoiComponent,
    PhieuNhapChuyenKhoCapNhatComponent
} from './pages';
import { DanhSachPhieuXuatChuyenKhoModalComponent } from './modals/danh-sach-phieu-xuat-chuyen-kho-modal/danh-sach-phieu-xuat-chuyen-kho-modal.component';
import { PhieuXuatKhoInPhieuModalComponent } from './modals/phieu-xuat-kho-in-phieu-modal/phieu-xuat-kho-in-phieu-modal.component';
import { PhieuNhapKhoInPhieuModalComponent } from './modals/phieu-nhap-kho-in-phieu-modal/phieu-nhap-kho-in-phieu-modal.component';

@NgModule({
    declarations: [
        PhieuNhapKhoThemMoiComponent,
        PhieuNhapKhoCapNhatComponent,
        PhieuNhapKhoComponent,
        PhieuXuatKhoComponent,
        PhieuXuatKhoThemMoiComponent,
        PhieuXuatKhoCapNhatComponent,
        PhieuDieuChinhKhoComponent,
        PhieuDieuChinhKhoCapNhatComponent,
        PhieuDieuChinhKhoThemMoiComponent,
        PhieuXuatChuyenKhoComponent,
        PhieuXuatChuyenKhoThemMoiComponent,
        PhieuXuatChuyenKhoCapNhatComponent,
        PhieuNhapChuyenKhoComponent,
        PhieuNhapChuyenKhoThemMoiComponent,
        PhieuNhapChuyenKhoCapNhatComponent,
        DanhSachPhieuXuatChuyenKhoModalComponent,
        PhieuXuatKhoInPhieuModalComponent,
        PhieuNhapKhoInPhieuModalComponent
    ],
    imports: [CommonModule, SharedModule, KhoHangRoutingModule]
})
export class KhoHangModule {}
