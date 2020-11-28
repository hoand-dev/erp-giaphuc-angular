import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { PhieuBanHangCapNhatComponent } from './pages/phieu-ban-hang-cap-nhat/phieu-ban-hang-cap-nhat.component';
import { PhieuBanHangThemMoiComponent } from './pages/phieu-ban-hang-them-moi/phieu-ban-hang-them-moi.component';
import { PhieuBanHangComponent } from './pages/phieu-ban-hang/phieu-ban-hang.component';
import { PhieuDatHangCapNhatComponent } from './pages/phieu-dat-hang-cap-nhat/phieu-dat-hang-cap-nhat.component';
import { PhieuDatHangThemMoiComponent } from './pages/phieu-dat-hang-them-moi/phieu-dat-hang-them-moi.component';
import { PhieuDatHangComponent } from './pages/phieu-dat-hang/phieu-dat-hang.component';
import { PhieuKhachTraHangCapNhatComponent } from './pages/phieu-khach-tra-hang-cap-nhat/phieu-khach-tra-hang-cap-nhat.component';
import { PhieuKhachTraHangThemMoiComponent } from './pages/phieu-khach-tra-hang-them-moi/phieu-khach-tra-hang-them-moi.component';
import { PhieuKhachTraHangComponent } from './pages/phieu-khach-tra-hang/phieu-khach-tra-hang.component';
import { TheoDoiHopDongCapNhatComponent } from './pages/theo-doi-hop-dong-cap-nhat/theo-doi-hop-dong-cap-nhat.component';
import { TheoDoiHopDongThemMoiComponent } from './pages/theo-doi-hop-dong-them-moi/theo-doi-hop-dong-them-moi.component';
import { TheoDoiHopDongComponent } from './pages/theo-doi-hop-dong/theo-doi-hop-dong.component';

const routes: Routes = [
    {
        path: 'theo-doi-hop-dong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: TheoDoiHopDongComponent },
            { path: 'them-moi', component: TheoDoiHopDongThemMoiComponent },
            { path: ':id/cap-nhat', component: TheoDoiHopDongCapNhatComponent }
        ]
    },
    {
        path: 'phieu-dat-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuDatHangComponent },
            { path: 'them-moi', component: PhieuDatHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuDatHangCapNhatComponent }
        ]
    },
    {
        path: 'phieu-ban-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuBanHangComponent },
            { path: 'them-moi', component: PhieuBanHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuBanHangCapNhatComponent }
        ]
    },
    {
        path: 'phieu-khach-tra-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuKhachTraHangComponent },
            { path: 'them-moi', component: PhieuKhachTraHangThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuKhachTraHangCapNhatComponent }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanHangRoutingModule { }
