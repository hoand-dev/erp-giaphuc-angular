import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanXuatGiaPhucRoutingModule } from './san-xuat-gia-phuc-routing.module';
import { LenhSanXuatComponent } from './pages/lenh-san-xuat/lenh-san-xuat.component';
import { LenhSanXuatModalComponent } from './modals/lenh-san-xuat-modal/lenh-san-xuat-modal.component';
import { SharedModule } from '..';

import { PhieuXuatVatTuModalComponent } from './modals/phieu-xuat-vat-tu-modal/phieu-xuat-vat-tu-modal.component';
import { PhieuXuatVatTuComponent } from './pages/phieu-xuat-vat-tu/phieu-xuat-vat-tu.component';
import { PhieuNhapVatTuModalComponent } from './modals/phieu-nhap-vat-tu-modal/phieu-nhap-vat-tu-modal.component';
import { PhieuNhapVatTuComponent } from './pages/phieu-nhap-vat-tu/phieu-nhap-vat-tu.component';
import { PhieuNhapThanhPhamComponent } from './pages/phieu-nhap-thanh-pham/phieu-nhap-thanh-pham.component';
import { PhieuNhapThanhPhamModalComponent } from './modals/phieu-nhap-thanh-pham-modal/phieu-nhap-thanh-pham-modal.component';

import { DanhSachLenhSanXuatModalComponent } from './modals/danh-sach-lenh-san-xuat-modal/danh-sach-lenh-san-xuat-modal.component';
import { DanhSachPhieuXuatVatTuModalComponent } from './modals/danh-sach-phieu-xuat-vat-tu-modal/danh-sach-phieu-xuat-vat-tu-modal.component';
import { PhieuXuatVatTuInPhieuModalComponent } from './modals/phieu-xuat-vat-tu-in-phieu-modal/phieu-xuat-vat-tu-in-phieu-modal.component';
import { PhieuNhapThanhPhamInPhieuModalComponent } from './modals/phieu-nhap-thanh-pham-in-phieu-modal/phieu-nhap-thanh-pham-in-phieu-modal.component';
import { PhieuNhapVatTuInPhieuModalComponent } from './modals/phieu-nhap-vat-tu-in-phieu-modal/phieu-nhap-vat-tu-in-phieu-modal.component';



@NgModule({
  declarations: [LenhSanXuatComponent, LenhSanXuatModalComponent, PhieuXuatVatTuModalComponent, PhieuXuatVatTuComponent, PhieuNhapVatTuModalComponent, DanhSachLenhSanXuatModalComponent, DanhSachPhieuXuatVatTuModalComponent, PhieuNhapVatTuComponent, PhieuNhapThanhPhamModalComponent, PhieuNhapThanhPhamComponent, PhieuXuatVatTuInPhieuModalComponent, PhieuNhapThanhPhamInPhieuModalComponent, PhieuNhapVatTuInPhieuModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    SanXuatGiaPhucRoutingModule
  ]
})
export class SanXuatGiaPhucModule { }
