import { SharedModule } from './../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThietLapRoutingModule } from './thiet-lap-routing.module';
import { ChiNhanhComponent } from './pages/chi-nhanh/chi-nhanh.component';
import { ChiNhanhThemMoiComponent } from './pages/chi-nhanh-them-moi/chi-nhanh-them-moi.component';
import { ChiNhanhCapNhatComponent } from './pages/chi-nhanh-cap-nhat/chi-nhanh-cap-nhat.component';
import { DanhMucGiaCongComponent } from './pages/danh-muc-gia-cong/danh-muc-gia-cong.component';
import { DanhMucGiaCongThemMoiComponent } from './pages/danh-muc-gia-cong-them-moi/danh-muc-gia-cong-them-moi.component';
import { DanhMucGiaCongCapNhatComponent } from './pages/danh-muc-gia-cong-cap-nhat/danh-muc-gia-cong-cap-nhat.component';
import { DanhMucLoiComponent } from './pages/danh-muc-loi/danh-muc-loi.component';
import { DanhMucLoiThemMoiComponent } from './pages/danh-muc-loi-them-moi/danh-muc-loi-them-moi.component';
import { DanhMucLoiCapNhatComponent } from './pages/danh-muc-loi-cap-nhat/danh-muc-loi-cap-nhat.component';
import { DanhMucNoComponent } from './pages/danh-muc-no/danh-muc-no.component';
import { DanhMucNoCapNhatComponent } from './pages/danh-muc-no-cap-nhat/danh-muc-no-cap-nhat.component';
import { DanhMucNoThemMoiComponent } from './pages/danh-muc-no-them-moi/danh-muc-no-them-moi.component';
import { DanhMucTieuChuanComponent } from './pages/danh-muc-tieu-chuan/danh-muc-tieu-chuan.component';
import { DanhMucTieuChuanCapNhatComponent } from './pages/danh-muc-tieu-chuan-cap-nhat/danh-muc-tieu-chuan-cap-nhat.component';

@NgModule({
    declarations: [ChiNhanhComponent, ChiNhanhThemMoiComponent, ChiNhanhCapNhatComponent, DanhMucGiaCongComponent, DanhMucGiaCongThemMoiComponent, DanhMucGiaCongCapNhatComponent, DanhMucLoiComponent, DanhMucLoiThemMoiComponent, DanhMucLoiCapNhatComponent, DanhMucNoComponent, DanhMucNoCapNhatComponent, DanhMucNoThemMoiComponent, DanhMucTieuChuanComponent, DanhMucTieuChuanCapNhatComponent],
    imports: [
        CommonModule,
        SharedModule,
        ThietLapRoutingModule
    ]
})
export class ThietLapModule { }
