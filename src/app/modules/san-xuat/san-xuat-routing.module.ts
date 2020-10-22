import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhieuCapPhatVatTuCapNhatComponent } from './pages/phieu-cap-phat-vat-tu-cap-nhat/phieu-cap-phat-vat-tu-cap-nhat.component';
import { PhieuCapPhatVatTuThemMoiComponent } from './pages/phieu-cap-phat-vat-tu-them-moi/phieu-cap-phat-vat-tu-them-moi.component';
import { PhieuCapPhatVatTuComponent } from './pages/phieu-cap-phat-vat-tu/phieu-cap-phat-vat-tu.component';

const routes: Routes = [
    {
        path: 'phieu-cap-phat-vat-tu',
        // component: ProductComponent,
        // canActivate: [AuthGuard],
        children: [
            { path: '', component: PhieuCapPhatVatTuComponent },
            { path: 'them-moi', component: PhieuCapPhatVatTuThemMoiComponent },
            { path: ':id/cap-nhat', component: PhieuCapPhatVatTuCapNhatComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanXuatRoutingModule { }
