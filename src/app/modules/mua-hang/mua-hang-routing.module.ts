import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* chỉ là import thôi mà nó quan trọng lắm nha ahihi ^_^ */
import { AuthGuard } from '@app/_helpers';
import {
    PhieuDatHangNCCComponent,
    PhieuDatHangNCCThemMoiComponent,
    PhieuDatHangNCCCapNhatComponent,
    PhieuMuaHangNCCCapNhatComponent,
    PhieuMuaHangNCCComponent,
    PhieuMuaHangNCCThemMoiComponent,
    PhieuTraHangNCCCapNhatComponent,
    PhieuTraHangNCCComponent,
    PhieuTraHangNCCThemMoiComponent
} from './pages';

const routes: Routes = [
    {
        path: 'phieu-dat-hang-ncc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuDatHangNCCComponent },
            { path: 'them-moi', component: PhieuDatHangNCCThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuDatHangNCCCapNhatComponent }
        ]
    },
    {
        path: 'phieu-mua-hang-ncc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuMuaHangNCCComponent },
            { path: 'them-moi', component: PhieuMuaHangNCCThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuMuaHangNCCCapNhatComponent }
        ]
    },
    {
        path: 'phieu-tra-hang-ncc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuTraHangNCCComponent },
            { path: 'them-moi', component: PhieuTraHangNCCThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuTraHangNCCCapNhatComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MuaHangRoutingModule {}
