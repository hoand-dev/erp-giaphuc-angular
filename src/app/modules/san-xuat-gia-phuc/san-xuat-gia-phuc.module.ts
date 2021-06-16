import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanXuatGiaPhucRoutingModule } from './san-xuat-gia-phuc-routing.module';
import { LenhSanXuatComponent } from './pages/lenh-san-xuat/lenh-san-xuat.component';
import { LenhSanXuatModalComponent } from './modals/lenh-san-xuat-modal/lenh-san-xuat-modal.component';
import { SharedModule } from '..';
import { PhieuNhapThanhPhamComponent } from './pages/phieu-nhap-thanh-pham/phieu-nhap-thanh-pham.component';
import { PhieuNhapThanhPhamModalComponent } from './modals/phieu-nhap-thanh-pham-modal/phieu-nhap-thanh-pham-modal.component';
import { DanhSachLenhSanXuatModalComponent } from './modals/danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';

@NgModule({
  declarations: [LenhSanXuatComponent, LenhSanXuatModalComponent, PhieuNhapThanhPhamComponent, PhieuNhapThanhPhamModalComponent, DanhSachLenhSanXuatModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    SanXuatGiaPhucRoutingModule
  ]
})
export class SanXuatGiaPhucModule { }
