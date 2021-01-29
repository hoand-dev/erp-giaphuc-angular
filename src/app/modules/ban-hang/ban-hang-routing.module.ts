import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';

import {
    BangGiaCapNhatComponent,
    BangGiaThemMoiComponent,
    BangGiaComponent,
    PhieuBanHangCapNhatComponent,
    PhieuBanHangThemMoiComponent,
    PhieuBanHangComponent,
    PhieuDatHangCapNhatComponent,
    PhieuDatHangThemMoiComponent,
    PhieuDatHangComponent,
    PhieuKhachTraHangCapNhatComponent,
    PhieuKhachTraHangThemMoiComponent,
    PhieuKhachTraHangComponent,
    TheoDoiHopDongCapNhatComponent,
    TheoDoiHopDongThemMoiComponent,
    TheoDoiHopDongComponent
} from './pages';

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
    {
        path: 'bang-gia',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: BangGiaComponent },
            { path: 'them-moi', component: BangGiaThemMoiComponent },
            { path: ':id/cap-nhat', component: BangGiaCapNhatComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BanHangRoutingModule {}
