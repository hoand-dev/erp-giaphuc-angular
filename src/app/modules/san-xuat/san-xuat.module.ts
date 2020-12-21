import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanXuatRoutingModule } from './san-xuat-routing.module';
import { PhieuCapPhatVatTuComponent } from './pages/phieu-cap-phat-vat-tu/phieu-cap-phat-vat-tu.component';
import { PhieuCapPhatVatTuThemMoiComponent } from './pages/phieu-cap-phat-vat-tu-them-moi/phieu-cap-phat-vat-tu-them-moi.component';
import { PhieuCapPhatVatTuCapNhatComponent } from './pages/phieu-cap-phat-vat-tu-cap-nhat/phieu-cap-phat-vat-tu-cap-nhat.component';
import { SharedModule } from '../shared.module';
import { BangGiaGiaCongComponent } from './pages/bang-gia-gia-cong/bang-gia-gia-cong.component';
import { BangGiaGiaCongThemMoiComponent } from './pages/bang-gia-gia-cong-them-moi/bang-gia-gia-cong-them-moi.component';
import { BangGiaGiaCongCapNhatComponent } from './pages/bang-gia-gia-cong-cap-nhat/bang-gia-gia-cong-cap-nhat.component';
import { PhieuXuatKhoGiaCongComponent } from './pages/phieu-xuat-kho-gia-cong/phieu-xuat-kho-gia-cong.component';
import { PhieuXuatKhoGiaCongThemMoiComponent } from './pages/phieu-xuat-kho-gia-cong-them-moi/phieu-xuat-kho-gia-cong-them-moi.component';
import { PhieuXuatKhoGiaCongCapNhatComponent } from './pages/phieu-xuat-kho-gia-cong-cap-nhat/phieu-xuat-kho-gia-cong-cap-nhat.component';


@NgModule({
    declarations: [PhieuCapPhatVatTuComponent, PhieuCapPhatVatTuThemMoiComponent, PhieuCapPhatVatTuCapNhatComponent, BangGiaGiaCongComponent, BangGiaGiaCongThemMoiComponent, BangGiaGiaCongCapNhatComponent, PhieuXuatKhoGiaCongComponent, PhieuXuatKhoGiaCongThemMoiComponent, PhieuXuatKhoGiaCongCapNhatComponent],
    imports: [
        CommonModule,
        SharedModule,
        SanXuatRoutingModule
    ]
})
export class SanXuatModule { }
