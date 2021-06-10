import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SanXuatGiaPhucRoutingModule } from './san-xuat-gia-phuc-routing.module';
import { LenhSanXuatComponent } from './pages/lenh-san-xuat/lenh-san-xuat.component';
import { LenhSanXuatModalComponent } from './modals/lenh-san-xuat-modal/lenh-san-xuat-modal.component';
import { SharedModule } from '..';


@NgModule({
  declarations: [LenhSanXuatComponent, LenhSanXuatModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    SanXuatGiaPhucRoutingModule
  ]
})
export class SanXuatGiaPhucModule { }
