import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';

import {
    PhieuNhapKhoComponent,
    PhieuNhapKhoCapNhatComponent,
    PhieuNhapKhoThemMoiComponent,
    PhieuXuatKhoCapNhatComponent,
    PhieuXuatKhoComponent,
    PhieuXuatKhoThemMoiComponent,
    PhieuDieuChinhKhoComponent,
    PhieuDieuChinhKhoCapNhatComponent,
    PhieuDieuChinhKhoThemMoiComponent,
    PhieuXuatChuyenKhoCapNhatComponent,
    PhieuXuatChuyenKhoComponent,
    PhieuXuatChuyenKhoThemMoiComponent,
    PhieuNhapChuyenKhoCapNhatComponent,
    PhieuNhapChuyenKhoComponent,
    PhieuNhapChuyenKhoThemMoiComponent,
    PhieuXuatMuonHangCapNhatComponent,
    PhieuXuatMuonHangComponent,
    PhieuXuatMuonHangThemMoiComponent,
    PhieuNhapTraMuonHangCapNhatComponent,
    PhieuNhapTraMuonHangThemMoiComponent,
    PhieuNhapTraMuonHangComponent,
    PhieuNhapMuonHangComponent,
    PhieuNhapMuonHangThemMoiComponent,
    PhieuNhapMuonHangCapNhatComponent,
    PhieuXuatTraMuonHangCapNhatComponent,
    PhieuXuatTraMuonHangComponent,
    PhieuXuatTraMuonHangThemMoiComponent
} from './pages';

const routes: Routes = [
    {
        path: 'phieu-nhap-kho',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapKhoComponent },
            { path: 'them-moi', component: PhieuNhapKhoThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuNhapKhoCapNhatComponent }
        ]
    },
    {
        path: 'phieu-xuat-kho',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatKhoComponent },
            { path: 'them-moi', component: PhieuXuatKhoThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuXuatKhoCapNhatComponent }
        ]
    },
    {
        path: 'phieu-xuat-chuyen-kho',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatChuyenKhoComponent },
            { path: 'them-moi', component: PhieuXuatChuyenKhoThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuXuatChuyenKhoCapNhatComponent }
        ]
    },
    {
        path: 'phieu-nhap-chuyen-kho',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapChuyenKhoComponent },
            { path: 'them-moi', component: PhieuNhapChuyenKhoThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuNhapChuyenKhoCapNhatComponent }
        ]
    },
    {
        path: 'phieu-dieu-chinh-kho',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuDieuChinhKhoComponent },
            { path: 'them-moi', component: PhieuDieuChinhKhoThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuDieuChinhKhoCapNhatComponent }
        ]
    },
    {
        path: 'phieu-xuat-muon-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatMuonHangComponent },
            { path: 'them-moi', component: PhieuXuatMuonHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuXuatMuonHangCapNhatComponent }
        ]
    },
    {
        path: 'phieu-nhap-tra-muon-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapTraMuonHangComponent },
            { path: 'them-moi', component: PhieuNhapTraMuonHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuNhapTraMuonHangCapNhatComponent }
        ]
    },
    {
        path: 'phieu-nhap-muon-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapMuonHangComponent },
            { path: 'them-moi', component: PhieuNhapMuonHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuNhapMuonHangCapNhatComponent }
        ]
    },
    {
        path: 'phieu-xuat-tra-muon-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatTraMuonHangComponent },
            { path: 'them-moi', component: PhieuXuatTraMuonHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuXuatTraMuonHangCapNhatComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KhoHangRoutingModule {}
