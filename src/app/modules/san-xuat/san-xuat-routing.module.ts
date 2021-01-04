import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { BangGiaGiaCongCapNhatComponent } from './pages/bang-gia-gia-cong-cap-nhat/bang-gia-gia-cong-cap-nhat.component';
import { BangGiaGiaCongThemMoiComponent } from './pages/bang-gia-gia-cong-them-moi/bang-gia-gia-cong-them-moi.component';
import { BangGiaGiaCongComponent } from './pages/bang-gia-gia-cong/bang-gia-gia-cong.component';
import { PhieuCapPhatVatTuCapNhatComponent } from './pages/phieu-cap-phat-vat-tu-cap-nhat/phieu-cap-phat-vat-tu-cap-nhat.component';
import { PhieuCapPhatVatTuThemMoiComponent } from './pages/phieu-cap-phat-vat-tu-them-moi/phieu-cap-phat-vat-tu-them-moi.component';
import { PhieuCapPhatVatTuComponent } from './pages/phieu-cap-phat-vat-tu/phieu-cap-phat-vat-tu.component';
import { PhieuXuatKhoGiaCongCapNhatComponent } from './pages/phieu-xuat-kho-gia-cong-cap-nhat/phieu-xuat-kho-gia-cong-cap-nhat.component';
import { PhieuXuatKhoGiaCongThemMoiComponent } from './pages/phieu-xuat-kho-gia-cong-them-moi/phieu-xuat-kho-gia-cong-them-moi.component';
import { PhieuXuatKhoGiaCongComponent } from './pages/phieu-xuat-kho-gia-cong/phieu-xuat-kho-gia-cong.component';
import { PhieuYeuCauGiaCongCapNhatComponent } from './pages/phieu-yeu-cau-gia-cong-cap-nhat/phieu-yeu-cau-gia-cong-cap-nhat.component';
import { PhieuYeuCauGiaCongThemMoiComponent } from './pages/phieu-yeu-cau-gia-cong-them-moi/phieu-yeu-cau-gia-cong-them-moi.component';
import { PhieuYeuCauGiaCongComponent } from './pages/phieu-yeu-cau-gia-cong/phieu-yeu-cau-gia-cong.component';
import { PhieuNhapKhoGiaCongComponent } from './pages/phieu-nhap-kho-gia-cong/phieu-nhap-kho-gia-cong.component';
import { PhieuNhapKhoGiaCongThemMoiComponent } from './pages/phieu-nhap-kho-gia-cong-them-moi/phieu-nhap-kho-gia-cong-them-moi.component';
import { PhieuNhapKhoGiaCongCapNhatComponent } from './pages/phieu-nhap-kho-gia-cong-cap-nhat/phieu-nhap-kho-gia-cong-cap-nhat.component';

const routes: Routes = [
    {
        path: 'phieu-cap-phat-vat-tu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuCapPhatVatTuComponent },
            { path: 'them-moi', component: PhieuCapPhatVatTuThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuCapPhatVatTuCapNhatComponent },
        ]
    },
    {
        path: 'bang-gia-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: BangGiaGiaCongComponent },
            { path: 'them-moi', component: BangGiaGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: BangGiaGiaCongCapNhatComponent },
        ]
    },
    {
        path: 'phieu-xuat-kho-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatKhoGiaCongComponent },
            { path: 'them-moi', component: PhieuXuatKhoGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuXuatKhoGiaCongCapNhatComponent },
        ]
    },
    {
        path: 'phieu-yeu-cau-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuYeuCauGiaCongComponent },
            { path: 'them-moi', component: PhieuYeuCauGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuYeuCauGiaCongCapNhatComponent },
        ]
    },
    {
        path: 'phieu-nhap-kho-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapKhoGiaCongComponent },
            { path: 'them-moi', component: PhieuNhapKhoGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuNhapKhoGiaCongCapNhatComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanXuatRoutingModule { }
