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
    PhieuNhapChuyenKhoCapNhatComponent,
    PhieuXuatMuonHangComponent,
    PhieuXuatMuonHangThemMoiComponent,
    PhieuXuatMuonHangCapNhatComponent,
    PhieuNhapTraMuonHangComponent,
    PhieuNhapTraMuonHangCapNhatComponent,
    PhieuNhapTraMuonHangThemMoiComponent,
    PhieuNhapMuonHangComponent,
    PhieuNhapMuonHangThemMoiComponent,
    PhieuNhapMuonHangCapNhatComponent,
    PhieuXuatTraMuonHangComponent,
    PhieuXuatTraMuonHangThemMoiComponent,
    PhieuXuatTraMuonHangCapNhatComponent,
} from './pages';

import { 
    DanhSachPhieuXuatChuyenKhoModalComponent,
    DanhSachPhieuXuatMuonHangModalComponent,
    DanhSachPhieuNhapMuonHangModalComponent,
    PhieuXuatKhoInPhieuModalComponent,
    PhieuXuatChuyenKhoInPhieuModalComponent,
    PhieuNhapChuyenKhoInPhieuModalComponent,
    PhieuNhapKhoInPhieuModalComponent,
    PhieuNhapMuonHangInPhieuModalComponent,
    PhieuXuatMuonHangInPhieuModalComponent,
    PhieuNhapTraMuonHangInPhieuModalComponent,
    PhieuXuatTraMuonHangInPhieuModalComponent,
 } from './modals';

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
        PhieuXuatChuyenKhoInPhieuModalComponent,
        PhieuNhapChuyenKhoInPhieuModalComponent,
        PhieuNhapKhoInPhieuModalComponent,
        PhieuXuatMuonHangComponent,
        PhieuXuatMuonHangThemMoiComponent,
        PhieuXuatMuonHangCapNhatComponent,
        PhieuNhapTraMuonHangComponent,
        PhieuNhapTraMuonHangCapNhatComponent,
        PhieuNhapTraMuonHangThemMoiComponent,
        DanhSachPhieuXuatMuonHangModalComponent,
        PhieuNhapMuonHangComponent,
        PhieuNhapMuonHangThemMoiComponent,
        PhieuNhapMuonHangCapNhatComponent,
        PhieuXuatTraMuonHangComponent,
        PhieuXuatTraMuonHangThemMoiComponent,
        PhieuXuatTraMuonHangCapNhatComponent,
        DanhSachPhieuNhapMuonHangModalComponent,
        PhieuNhapMuonHangInPhieuModalComponent,
        PhieuXuatMuonHangInPhieuModalComponent,
        PhieuNhapTraMuonHangInPhieuModalComponent,
        PhieuXuatTraMuonHangInPhieuModalComponent
    ],
    imports: [CommonModule, SharedModule, KhoHangRoutingModule]
})
export class KhoHangModule {}
