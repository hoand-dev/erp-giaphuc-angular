import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { PhieuDatHangCapNhatComponent } from './pages/phieu-dat-hang-cap-nhat/phieu-dat-hang-cap-nhat.component';
import { PhieuDatHangThemMoiComponent } from './pages/phieu-dat-hang-them-moi/phieu-dat-hang-them-moi.component';
import { PhieuDatHangComponent } from './pages/phieu-dat-hang/phieu-dat-hang.component';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanHangRoutingModule { }
