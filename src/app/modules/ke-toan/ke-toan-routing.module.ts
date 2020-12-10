import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { PhieuThuCapNhatComponent } from './pages/phieu-thu-cap-nhat/phieu-thu-cap-nhat.component';
import { PhieuThuThemMoiComponent } from './pages/phieu-thu-them-moi/phieu-thu-them-moi.component';
import { PhieuThuComponent } from './pages/phieu-thu/phieu-thu.component';
import { LenhVayComponent } from './pages/lenh-vay/lenh-vay.component';
import { LenhVayCapNhatComponent } from './pages/lenh-vay-cap-nhat/lenh-vay-cap-nhat.component';
import { LenhVayThemMoiComponent } from './pages/lenh-vay-them-moi/lenh-vay-them-moi.component';

const routes: Routes = [
    {
        path: 'phieu-thu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuThuComponent },
            { path: 'them-moi', component: PhieuThuThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuThuCapNhatComponent }
        ]
    },
    {
        path: 'lenh-vay',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: LenhVayComponent },
            { path: 'them-moi', component: LenhVayThemMoiComponent },
            { path: ':id/cap-nhat', component: LenhVayCapNhatComponent }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeToanRoutingModule { }
