import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanHangRoutingModule } from './ban-hang-routing.module';
import { TheoDoiHopDongComponent } from './pages/theo-doi-hop-dong/theo-doi-hop-dong.component';
import { TheoDoiHopDongThemMoiComponent } from './pages/theo-doi-hop-dong-them-moi/theo-doi-hop-dong-them-moi.component';
import { TheoDoiHopDongCapNhatComponent } from './pages/theo-doi-hop-dong-cap-nhat/theo-doi-hop-dong-cap-nhat.component';
import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [TheoDoiHopDongComponent, TheoDoiHopDongThemMoiComponent, TheoDoiHopDongCapNhatComponent],
  imports: [
    CommonModule,
    SharedModule,
    BanHangRoutingModule
  ]
})
export class BanHangModule { }
