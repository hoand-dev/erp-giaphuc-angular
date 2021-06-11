import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { LenhSanXuatComponent } from './pages/lenh-san-xuat/lenh-san-xuat.component';

const routes: Routes = [
    {
        path: 'lenh-san-xuat',
        canActivate: [AuthGuard],
        children: [{ path: '', component: LenhSanXuatComponent }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SanXuatGiaPhucRoutingModule {}
