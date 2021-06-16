import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { LenhSanXuatComponent } from './pages/lenh-san-xuat/lenh-san-xuat.component';
import { PhieuNhapThanhPhamComponent } from './pages/phieu-nhap-thanh-pham/phieu-nhap-thanh-pham.component';

const routes: Routes = [
    {
        path: 'lenh-san-xuat',
        canActivate: [AuthGuard],
        children: [{ path: '', component: LenhSanXuatComponent }]
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
