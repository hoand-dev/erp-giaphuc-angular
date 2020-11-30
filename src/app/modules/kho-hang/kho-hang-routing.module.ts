import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';

import { PhieuNhapKhoComponent, PhieuNhapKhoCapNhatComponent, PhieuNhapKhoThemMoiComponent, PhieuXuatKhoCapNhatComponent, PhieuXuatKhoComponent, PhieuXuatKhoThemMoiComponent, PhieuDieuChinhKhoComponent, PhieuDieuChinhKhoCapNhatComponent, PhieuDieuChinhKhoThemMoiComponent, PhieuXuatChuyenKhoCapNhatComponent, PhieuXuatChuyenKhoComponent, PhieuXuatChuyenKhoThemMoiComponent, PhieuNhapChuyenKhoCapNhatComponent, PhieuNhapChuyenKhoComponent, PhieuNhapChuyenKhoThemMoiComponent } from './pages';

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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KhoHangRoutingModule {}
