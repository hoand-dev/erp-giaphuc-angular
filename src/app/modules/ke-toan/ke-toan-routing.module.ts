import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { PhieuChiCapNhatComponent } from './pages/phieu-chi-cap-nhat/phieu-chi-cap-nhat.component';
import { PhieuChiThemMoiComponent } from './pages/phieu-chi-them-moi/phieu-chi-them-moi.component';
import { PhieuChiComponent } from './pages/phieu-chi/phieu-chi.component';
import { PhieuThuCapNhatComponent } from './pages/phieu-thu-cap-nhat/phieu-thu-cap-nhat.component';
import { PhieuThuThemMoiComponent } from './pages/phieu-thu-them-moi/phieu-thu-them-moi.component';
import { PhieuThuComponent } from './pages/phieu-thu/phieu-thu.component';

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
        path: 'phieu-chi',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuChiComponent },
            { path: 'them-moi', component: PhieuChiThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuChiCapNhatComponent }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeToanRoutingModule { }
