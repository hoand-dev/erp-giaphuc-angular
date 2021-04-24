import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* chỉ là import thôi mà nó quan trọng lắm nha ahihi ^_^ */
import { AuthGuard } from '@app/_helpers';
import { Ipv4Component, LichSuComponent } from './pages';
import { TrangThaiHoatDongComponent } from './pages/trang-thai-hoat-dong/trang-thai-hoat-dong.component';

const routes: Routes = [
    {
        path: 'he-thong',
        canActivate: [AuthGuard],
        children: [
            { path: 'lich-su', component: LichSuComponent },
            { path: 'ip-dang-nhap', component: Ipv4Component },
            { path: 'trang-thai-hoat-dong', component: TrangThaiHoatDongComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HeThongRoutingModule {}
