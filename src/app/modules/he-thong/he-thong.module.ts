import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared.module';
import { HeThongRoutingModule } from './he-thong-routing.module';
import { LichSuComponent } from './pages/lich-su/lich-su.component';

@NgModule({
    declarations: [LichSuComponent],
    imports: [CommonModule, SharedModule, HeThongRoutingModule]
})
export class HeThongModule {}
