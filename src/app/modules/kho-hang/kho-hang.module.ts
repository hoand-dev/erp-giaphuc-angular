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
import { PhieuDieuChinhKhoInPhieuModalComponent } from './modals/phieu-dieu-chinh-kho-in-phieu-modal/phieu-dieu-chinh-kho-in-phieu-modal.component';
import { PhieuNhapKhoViewModalComponent } from './modals/phieu-nhap-kho-view-modal/phieu-nhap-kho-view-modal.component';
import { PhieuDieuChinhKhoViewModalComponent } from './modals/phieu-dieu-chinh-kho-view-modal/phieu-dieu-chinh-kho-view-modal.component';
import { PhieuXuatChuyenKhoViewModalComponent } from './modals/phieu-xuat-chuyen-kho-view-modal/phieu-xuat-chuyen-kho-view-modal.component';
import { PhieuNhapChuyenKhoViewModalComponent } from './modals/phieu-nhap-chuyen-kho-view-modal/phieu-nhap-chuyen-kho-view-modal.component';
import { PhieuXuatMuonViewModalComponent } from './modals/phieu-xuat-muon-view-modal/phieu-xuat-muon-view-modal.component';
import { PhieuNhapTraViewModalComponent } from './modals/phieu-nhap-tra-view-modal/phieu-nhap-tra-view-modal.component';
import { PhieuNhapMuonViewModalComponent } from './modals/phieu-nhap-muon-view-modal/phieu-nhap-muon-view-modal.component';
import { PhieuXuatTraViewModalComponent } from './modals/phieu-xuat-tra-view-modal/phieu-xuat-tra-view-modal.component';

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
        PhieuXuatTraMuonHangInPhieuModalComponent,
        PhieuDieuChinhKhoInPhieuModalComponent,
        PhieuNhapKhoViewModalComponent,
        PhieuDieuChinhKhoViewModalComponent,
        PhieuXuatChuyenKhoViewModalComponent,
        PhieuNhapChuyenKhoViewModalComponent,
        PhieuXuatMuonViewModalComponent,
        PhieuNhapTraViewModalComponent,
        PhieuNhapMuonViewModalComponent,
        PhieuXuatTraViewModalComponent
    ],
    imports: [CommonModule, SharedModule, KhoHangRoutingModule]
})
export class KhoHangModule {}
