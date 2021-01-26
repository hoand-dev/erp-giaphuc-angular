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
import { PhieuXuatChuyenKhoInPhieuModalComponent } from './modals/phieu-xuat-chuyen-kho-in-phieu-modal/phieu-xuat-chuyen-kho-in-phieu-modal.component';
import { PhieuNhapChuyenKhoInPhieuModalComponent } from './modals/phieu-nhap-chuyen-kho-in-phieu-modal/phieu-nhap-chuyen-kho-in-phieu-modal.component';
import { PhieuNhapKhoInPhieuModalComponent } from './modals/phieu-nhap-kho-in-phieu-modal/phieu-nhap-kho-in-phieu-modal.component';
import { PhieuXuatMuonHangComponent } from './pages/phieu-xuat-muon-hang/phieu-xuat-muon-hang.component';
import { PhieuXuatMuonHangThemMoiComponent } from './pages/phieu-xuat-muon-hang-them-moi/phieu-xuat-muon-hang-them-moi.component';
import { PhieuXuatMuonHangCapNhatComponent } from './pages/phieu-xuat-muon-hang-cap-nhat/phieu-xuat-muon-hang-cap-nhat.component';
import { PhieuNhapTraMuonHangComponent } from './pages/phieu-nhap-tra-muon-hang/phieu-nhap-tra-muon-hang.component';
import { PhieuNhapTraMuonHangCapNhatComponent } from './pages/phieu-nhap-tra-muon-hang-cap-nhat/phieu-nhap-tra-muon-hang-cap-nhat.component';
import { PhieuNhapTraMuonHangThemMoiComponent } from './pages/phieu-nhap-tra-muon-hang-them-moi/phieu-nhap-tra-muon-hang-them-moi.component';
import { DanhSachPhieuXuatMuonHangModalComponent } from './modals/danh-sach-phieu-xuat-muon-hang-modal/danh-sach-phieu-xuat-muon-hang-modal.component';
import { PhieuNhapMuonHangComponent } from './pages/phieu-nhap-muon-hang/phieu-nhap-muon-hang.component';
import { PhieuNhapMuonHangThemMoiComponent } from './pages/phieu-nhap-muon-hang-them-moi/phieu-nhap-muon-hang-them-moi.component';
import { PhieuNhapMuonHangCapNhatComponent } from './pages/phieu-nhap-muon-hang-cap-nhat/phieu-nhap-muon-hang-cap-nhat.component';
import { PhieuXuatTraMuonHangComponent } from './pages/phieu-xuat-tra-muon-hang/phieu-xuat-tra-muon-hang.component';
import { PhieuXuatTraMuonHangThemMoiComponent } from './pages/phieu-xuat-tra-muon-hang-them-moi/phieu-xuat-tra-muon-hang-them-moi.component';
import { PhieuXuatTraMuonHangCapNhatComponent } from './pages/phieu-xuat-tra-muon-hang-cap-nhat/phieu-xuat-tra-muon-hang-cap-nhat.component';
import { DanhSachPhieuNhapMuonHangModalComponent } from './modals/danh-sach-phieu-nhap-muon-hang-modal/danh-sach-phieu-nhap-muon-hang-modal.component';

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
        DanhSachPhieuNhapMuonHangModalComponent
    ],
    imports: [CommonModule, SharedModule, KhoHangRoutingModule]
})
export class KhoHangModule {}
