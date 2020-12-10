import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeToanRoutingModule { }
