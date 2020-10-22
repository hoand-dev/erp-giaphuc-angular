import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanXuatRoutingModule } from './san-xuat-routing.module';
import { PhieuCapPhatVatTuComponent } from './pages/phieu-cap-phat-vat-tu/phieu-cap-phat-vat-tu.component';
import { PhieuCapPhatVatTuThemMoiComponent } from './pages/phieu-cap-phat-vat-tu-them-moi/phieu-cap-phat-vat-tu-them-moi.component';
import { PhieuCapPhatVatTuCapNhatComponent } from './pages/phieu-cap-phat-vat-tu-cap-nhat/phieu-cap-phat-vat-tu-cap-nhat.component';
import { SharedModule } from '../shared.module';


@NgModule({
    declarations: [PhieuCapPhatVatTuComponent, PhieuCapPhatVatTuThemMoiComponent, PhieuCapPhatVatTuCapNhatComponent],
    imports: [
        CommonModule,
        SharedModule,
        SanXuatRoutingModule
    ]
})
export class SanXuatModule { }
