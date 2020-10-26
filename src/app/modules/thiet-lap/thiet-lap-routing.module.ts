import { KhoHangComponent } from './pages/kho-hang/kho-hang.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_helpers';

import { ChiNhanhCapNhatComponent } from './pages/chi-nhanh-cap-nhat/chi-nhanh-cap-nhat.component';
import { ChiNhanhThemMoiComponent } from './pages/chi-nhanh-them-moi/chi-nhanh-them-moi.component';
import { ChiNhanhComponent } from './pages/chi-nhanh/chi-nhanh.component';
import { DanhMucGiaCongCapNhatComponent } from './pages/danh-muc-gia-cong-cap-nhat/danh-muc-gia-cong-cap-nhat.component';
import { DanhMucGiaCongThemMoiComponent } from './pages/danh-muc-gia-cong-them-moi/danh-muc-gia-cong-them-moi.component';
import { DanhMucGiaCongComponent } from './pages/danh-muc-gia-cong/danh-muc-gia-cong.component';
import { DanhMucLoiCapNhatComponent } from './pages/danh-muc-loi-cap-nhat/danh-muc-loi-cap-nhat.component';
import { DanhMucLoiThemMoiComponent } from './pages/danh-muc-loi-them-moi/danh-muc-loi-them-moi.component';
import { DanhMucLoiComponent } from './pages/danh-muc-loi/danh-muc-loi.component';
import { DanhMucNoCapNhatComponent } from './pages/danh-muc-no-cap-nhat/danh-muc-no-cap-nhat.component';
import { DanhMucNoThemMoiComponent } from './pages/danh-muc-no-them-moi/danh-muc-no-them-moi.component';
import { DanhMucNoComponent } from './pages/danh-muc-no/danh-muc-no.component';

const routes: Routes = [
    {
        path: 'chi-nhanh',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: ChiNhanhComponent },
            { path: 'them-moi', component: ChiNhanhThemMoiComponent },
            { path: ':id/cap-nhat', component: ChiNhanhCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucGiaCongComponent },
            { path: 'them-moi', component: DanhMucGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucGiaCongCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-loi',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucLoiComponent },
            { path: 'them-moi', component: DanhMucLoiThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucLoiCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-no',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucNoComponent },
            { path: 'them-moi', component: DanhMucNoThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucNoCapNhatComponent },
        ]
    },
    {
        path: 'kho-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: KhoHangComponent },
            //{ path: 'them-moi', component: DanhMucNoThemMoiComponent },
            //{ path: ':id/cap-nhat', component: DanhMucNoCapNhatComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThietLapRoutingModule { }
