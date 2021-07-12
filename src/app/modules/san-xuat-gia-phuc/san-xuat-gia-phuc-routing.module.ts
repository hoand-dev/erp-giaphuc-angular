import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { LenhSanXuatComponent } from './pages/lenh-san-xuat/lenh-san-xuat.component';
import { PhieuNhapVatTuComponent } from './pages/phieu-nhap-vat-tu/phieu-nhap-vat-tu.component';
import { PhieuXuatVatTuComponent } from './pages/phieu-xuat-vat-tu/phieu-xuat-vat-tu.component';
import { PhieuNhapThanhPhamComponent } from './pages/phieu-nhap-thanh-pham/phieu-nhap-thanh-pham.component';

const routes: Routes = [
    {
        path: 'lenh-san-xuat',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: LenhSanXuatComponent }
        ]
    },
    {
        path: 'phieu-xuat-vat-tu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuXuatVatTuComponent }
        ]
    },
    {
        path: 'phieu-nhap-vat-tu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuNhapVatTuComponent }
        ]
    },  
    {
        path: 'nhap-thanh-pham',
        canActivate: [AuthGuard],
        children: [{ path: '', component: PhieuNhapThanhPhamComponent }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SanXuatGiaPhucRoutingModule {}
