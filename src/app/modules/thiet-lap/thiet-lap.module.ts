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
import { DanhMucTieuChuanThemMoiComponent } from './pages/danh-muc-tieu-chuan-them-moi/danh-muc-tieu-chuan-them-moi.component';
import { KhoHangComponent } from './pages/kho-hang/kho-hang.component';
import { KhoHangThemMoiComponent } from './pages/kho-hang-them-moi/kho-hang-them-moi.component';
import { KhoHangCapNhatComponent } from './pages/kho-hang-cap-nhat/kho-hang-cap-nhat.component';
import { DonViTinhComponent } from './pages/don-vi-tinh/don-vi-tinh.component';
import { DonViTinhThemMoiComponent } from './pages/don-vi-tinh-them-moi/don-vi-tinh-them-moi.component';
import { DonViTinhCapNhatComponent } from './pages/don-vi-tinh-cap-nhat/don-vi-tinh-cap-nhat.component';
import { DonViGiaCongComponent } from './pages/don-vi-gia-cong/don-vi-gia-cong.component';
import { DonViGiaCongThemMoiComponent } from './pages/don-vi-gia-cong-them-moi/don-vi-gia-cong-them-moi.component';
import { DonViGiaCongCapNhatComponent } from './pages/don-vi-gia-cong-cap-nhat/don-vi-gia-cong-cap-nhat.component';
import { NoiDungThuChiComponent } from './pages/noi-dung-thu-chi/noi-dung-thu-chi.component';
import { NoiDungThuChiCapNhatComponent } from './pages/noi-dung-thu-chi-cap-nhat/noi-dung-thu-chi-cap-nhat.component';
import { NoiDungThuChiThemMoiComponent } from './pages/noi-dung-thu-chi-them-moi/noi-dung-thu-chi-them-moi.component';
import { QuyTaiKhoanComponent } from './pages/quy-tai-khoan/quy-tai-khoan.component';
import { QuyTaiKhoanCapNhatComponent } from './pages/quy-tai-khoan-cap-nhat/quy-tai-khoan-cap-nhat.component';
import { QuyTaiKhoanThemMoiComponent } from './pages/quy-tai-khoan-them-moi/quy-tai-khoan-them-moi.component';
import { SoMatComponent } from './pages/so-mat/so-mat.component';
import { SoMatCapNhatComponent } from './pages/so-mat-cap-nhat/so-mat-cap-nhat.component';
import { SoMatThemMoiComponent } from './pages/so-mat-them-moi/so-mat-them-moi.component';
import { NguonNhanLucComponent } from './pages/nguon-nhan-luc/nguon-nhan-luc.component';
import { NguonNhanLucCapNhatComponent } from './pages/nguon-nhan-luc-cap-nhat/nguon-nhan-luc-cap-nhat.component';
import { NguonNhanLucThemMoiComponent } from './pages/nguon-nhan-luc-them-moi/nguon-nhan-luc-them-moi.component';
import { HangHoaNguyenLieuComponent } from './pages/hang-hoa-nguyen-lieu/hang-hoa-nguyen-lieu.component';
import { HangHoaNguyenLieuCapNhatComponent } from './pages/hang-hoa-nguyen-lieu-cap-nhat/hang-hoa-nguyen-lieu-cap-nhat.component';
import { HangHoaNguyenLieuThemMoiComponent } from './pages/hang-hoa-nguyen-lieu-them-moi/hang-hoa-nguyen-lieu-them-moi.component';
import { HangHoaHangTronComponent } from './pages/hang-hoa-hang-tron/hang-hoa-hang-tron.component';
import { HangHoaHangTronCapNhatComponent } from './pages/hang-hoa-hang-tron-cap-nhat/hang-hoa-hang-tron-cap-nhat.component';
import { HangHoaHangTronThemMoiComponent } from './pages/hang-hoa-hang-tron-them-moi/hang-hoa-hang-tron-them-moi.component';
import { DanhSachXeComponent } from './pages/danh-sach-xe/danh-sach-xe.component';
import { DanhSachXeCapNhatComponent } from './pages/danh-sach-xe-cap-nhat/danh-sach-xe-cap-nhat.component';
import { DanhSachXeThemMoiComponent } from './pages/danh-sach-xe-them-moi/danh-sach-xe-them-moi.component';

@NgModule({
    declarations: [ChiNhanhComponent, ChiNhanhThemMoiComponent, ChiNhanhCapNhatComponent, DanhMucGiaCongComponent, DanhMucGiaCongThemMoiComponent, DanhMucGiaCongCapNhatComponent, DanhMucLoiComponent, DanhMucLoiThemMoiComponent, DanhMucLoiCapNhatComponent, DanhMucNoComponent, DanhMucNoCapNhatComponent, DanhMucNoThemMoiComponent, DanhMucTieuChuanComponent, DanhMucTieuChuanCapNhatComponent, DanhMucTieuChuanThemMoiComponent, KhoHangComponent, KhoHangThemMoiComponent, KhoHangCapNhatComponent, DonViTinhComponent, DonViTinhThemMoiComponent, DonViTinhCapNhatComponent, DonViGiaCongComponent, DonViGiaCongThemMoiComponent, DonViGiaCongCapNhatComponent, NoiDungThuChiComponent, NoiDungThuChiCapNhatComponent, NoiDungThuChiThemMoiComponent, QuyTaiKhoanComponent, QuyTaiKhoanCapNhatComponent, QuyTaiKhoanThemMoiComponent, SoMatComponent, SoMatCapNhatComponent, SoMatThemMoiComponent, NguonNhanLucComponent, NguonNhanLucCapNhatComponent, NguonNhanLucThemMoiComponent, HangHoaNguyenLieuComponent, HangHoaNguyenLieuCapNhatComponent, HangHoaNguyenLieuThemMoiComponent, HangHoaHangTronComponent, HangHoaHangTronCapNhatComponent, HangHoaHangTronThemMoiComponent, DanhSachXeComponent, DanhSachXeCapNhatComponent, DanhSachXeThemMoiComponent],
    imports: [
        CommonModule,
        SharedModule,
        ThietLapRoutingModule
    ]
})
export class ThietLapModule { }
