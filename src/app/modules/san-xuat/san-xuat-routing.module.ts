import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';

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

const routes: Routes = [
    {
        path: 'phieu-cap-phat-vat-tu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuCapPhatVatTuComponent },
            { path: 'them-moi', component: PhieuCapPhatVatTuThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuCapPhatVatTuCapNhatComponent }
        ]
    },
    {
        path: 'bang-gia-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: BangGiaGiaCongComponent },
            { path: 'them-moi', component: BangGiaGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: BangGiaGiaCongCapNhatComponent }
        ]
    },
    {
        path: 'phieu-xuat-kho-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatKhoGiaCongComponent },
            { path: 'them-moi', component: PhieuXuatKhoGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuXuatKhoGiaCongCapNhatComponent }
        ]
    },
    {
        path: 'phieu-yeu-cau-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuYeuCauGiaCongComponent },
            { path: 'them-moi', component: PhieuYeuCauGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuYeuCauGiaCongCapNhatComponent }
        ]
    },
    {
        path: 'phieu-nhap-kho-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapKhoGiaCongComponent },
            { path: 'them-moi', component: PhieuNhapKhoGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuNhapKhoGiaCongCapNhatComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SanXuatRoutingModule {}
