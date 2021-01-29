import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';

import {
    PhieuChiCapNhatComponent,
    PhieuChiThemMoiComponent,
    PhieuChiComponent,
    PhieuThuCapNhatComponent,
    PhieuThuThemMoiComponent,
    PhieuThuComponent,
    LenhVayComponent,
    LenhVayCapNhatComponent,
    LenhVayThemMoiComponent,
    PhieuCanTruComponent,
    PhieuCanTruCapNhatComponent,
    PhieuCanTruThemMoiComponent
} from './pages';

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
    {
        path: 'lenh-vay',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: LenhVayComponent },
            { path: 'them-moi', component: LenhVayThemMoiComponent },
            { path: ':id/cap-nhat', component: LenhVayCapNhatComponent }
        ]
    },
    {
        path: 'phieu-can-tru',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuCanTruComponent },
            { path: 'them-moi', component: PhieuCanTruThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuCanTruCapNhatComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KeToanRoutingModule {}
