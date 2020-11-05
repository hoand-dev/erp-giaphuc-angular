import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_helpers';

import { ChiNhanhCapNhatComponent } from './pages/chi-nhanh-cap-nhat/chi-nhanh-cap-nhat.component';
import { ChiNhanhThemMoiComponent } from './pages/chi-nhanh-them-moi/chi-nhanh-them-moi.component';
import { ChiNhanhComponent } from './pages/chi-nhanh/chi-nhanh.component';
import { DanhMucGiaCongCapNhatComponent } from './pages/danh-muc-gia-cong-cap-nhat/danh-muc-gia-cong-cap-nhat.component';
import { DanhMucGiaCongThemMoiComponent } from './pages/danh-muc-gia-cong-them-moi/danh-muc-gia-cong-them-moi.component';
import { DanhMucGiaCongComponent } from './pages/danh-muc-gia-cong/danh-muc-gia-cong.component';
import { DanhMucLoiCapNhatComponent } from './pages/danh-muc-loi-cap-nhat/danh-muc-loi-cap-nhat.component';
import { DanhMucLoiThemMoiComponent } from './pages/danh-muc-loi-them-moi/danh-muc-loi-them-moi.component';
import { DanhMucLoiComponent } from './pages/danh-muc-loi/danh-muc-loi.component';
import { DanhMucNoCapNhatComponent } from './pages/danh-muc-no-cap-nhat/danh-muc-no-cap-nhat.component';
import { DanhMucNoThemMoiComponent } from './pages/danh-muc-no-them-moi/danh-muc-no-them-moi.component';
import { DanhMucNoComponent } from './pages/danh-muc-no/danh-muc-no.component';
import { DonViTinhCapNhatComponent } from './pages/don-vi-tinh-cap-nhat/don-vi-tinh-cap-nhat.component';
import { DonViTinhThemMoiComponent } from './pages/don-vi-tinh-them-moi/don-vi-tinh-them-moi.component';
import { DonViTinhComponent } from './pages/don-vi-tinh/don-vi-tinh.component';
import { KhoHangComponent } from './pages/kho-hang/kho-hang.component';
import { KhoHangThemMoiComponent } from './pages/kho-hang-them-moi/kho-hang-them-moi.component';
import { KhoHangCapNhatComponent } from './pages/kho-hang-cap-nhat/kho-hang-cap-nhat.component';
import { DanhMucTieuChuanComponent } from './pages/danh-muc-tieu-chuan/danh-muc-tieu-chuan.component';
import { DanhMucTieuChuanThemMoiComponent } from './pages/danh-muc-tieu-chuan-them-moi/danh-muc-tieu-chuan-them-moi.component';
import { DanhMucTieuChuanCapNhatComponent } from './pages/danh-muc-tieu-chuan-cap-nhat/danh-muc-tieu-chuan-cap-nhat.component';
import { DonViGiaCongComponent } from './pages/don-vi-gia-cong/don-vi-gia-cong.component';
import { DonViGiaCongThemMoiComponent } from './pages/don-vi-gia-cong-them-moi/don-vi-gia-cong-them-moi.component';
import { DonViGiaCongCapNhatComponent } from './pages/don-vi-gia-cong-cap-nhat/don-vi-gia-cong-cap-nhat.component';
import { NoiDungThuChiComponent } from './pages/noi-dung-thu-chi/noi-dung-thu-chi.component';
import { NoiDungThuChiThemMoiComponent } from './pages/noi-dung-thu-chi-them-moi/noi-dung-thu-chi-them-moi.component';
import { NoiDungThuChiCapNhatComponent } from './pages/noi-dung-thu-chi-cap-nhat/noi-dung-thu-chi-cap-nhat.component';
import { SoMatComponent } from './pages/so-mat/so-mat.component';
import { SoMatThemMoiComponent } from './pages/so-mat-them-moi/so-mat-them-moi.component';
import { SoMatCapNhatComponent } from './pages/so-mat-cap-nhat/so-mat-cap-nhat.component';
import { QuyTaiKhoanCapNhatComponent } from './pages/quy-tai-khoan-cap-nhat/quy-tai-khoan-cap-nhat.component';
import { QuyTaiKhoanThemMoiComponent } from './pages/quy-tai-khoan-them-moi/quy-tai-khoan-them-moi.component';
import { QuyTaiKhoanComponent } from './pages/quy-tai-khoan/quy-tai-khoan.component';
import { NguonNhanLucCapNhatComponent } from './pages/nguon-nhan-luc-cap-nhat/nguon-nhan-luc-cap-nhat.component';
import { NguonNhanLucThemMoiComponent } from './pages/nguon-nhan-luc-them-moi/nguon-nhan-luc-them-moi.component';
import { NguonNhanLucComponent } from './pages/nguon-nhan-luc/nguon-nhan-luc.component';
import { HangHoaNguyenLieuComponent } from './pages/hang-hoa-nguyen-lieu/hang-hoa-nguyen-lieu.component';
import { HangHoaNguyenLieuThemMoiComponent } from './pages/hang-hoa-nguyen-lieu-them-moi/hang-hoa-nguyen-lieu-them-moi.component';
import { HangHoaNguyenLieuCapNhatComponent } from './pages/hang-hoa-nguyen-lieu-cap-nhat/hang-hoa-nguyen-lieu-cap-nhat.component';
import { HangHoaHangTronComponent } from './pages/hang-hoa-hang-tron/hang-hoa-hang-tron.component';
import { HangHoaHangTronCapNhatComponent } from './pages/hang-hoa-hang-tron-cap-nhat/hang-hoa-hang-tron-cap-nhat.component';
import { HangHoaHangTronThemMoiComponent } from './pages/hang-hoa-hang-tron-them-moi/hang-hoa-hang-tron-them-moi.component';
import { DanhSachXeComponent } from './pages/danh-sach-xe/danh-sach-xe.component';
import { DanhSachXeCapNhatComponent } from './pages/danh-sach-xe-cap-nhat/danh-sach-xe-cap-nhat.component';
import { DanhSachXeThemMoiComponent } from './pages/danh-sach-xe-them-moi/danh-sach-xe-them-moi.component';

const routes: Routes = [
    {
        path: 'chi-nhanh',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: ChiNhanhComponent },
            { path: 'them-moi', component: ChiNhanhThemMoiComponent },
            { path: ':id/cap-nhat', component: ChiNhanhCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucGiaCongComponent },
            { path: 'them-moi', component: DanhMucGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucGiaCongCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-loi',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucLoiComponent },
            { path: 'them-moi', component: DanhMucLoiThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucLoiCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-no',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucNoComponent },
            { path: 'them-moi', component: DanhMucNoThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucNoCapNhatComponent },
        ]
    },
    {
        path: 'danh-muc-tieu-chuan',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucTieuChuanComponent },
            { path: 'them-moi', component: DanhMucTieuChuanThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucTieuChuanCapNhatComponent },
        ]
    },
    {
        path: 'don-vi-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DonViGiaCongComponent },
            { path: 'them-moi', component: DonViGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: DonViGiaCongCapNhatComponent },
        ]
    },
    {
        path: 'don-vi-tinh',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DonViTinhComponent },
            { path: 'them-moi', component: DonViTinhThemMoiComponent },
            { path: ':id/cap-nhat', component: DonViTinhCapNhatComponent },
        ]
    },
    {
        path: 'nguon-nhan-luc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: NguonNhanLucComponent },
            { path: 'them-moi', component: NguonNhanLucThemMoiComponent },
            { path: ':id/cap-nhat', component: NguonNhanLucCapNhatComponent },
        ]
    },
    {
        path: 'noi-dung-thu-chi',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: NoiDungThuChiComponent },
            { path: 'them-moi', component: NoiDungThuChiThemMoiComponent },
            { path: ':id/cap-nhat', component: NoiDungThuChiCapNhatComponent },
        ]
    },
    {
        path: 'quy-tai-khoan',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: QuyTaiKhoanComponent },
            { path: 'them-moi', component: QuyTaiKhoanThemMoiComponent },
            { path: ':id/cap-nhat', component: QuyTaiKhoanCapNhatComponent },
        ]
    },
    {
        path: 'so-mat',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: SoMatComponent },
            { path: 'them-moi', component: SoMatThemMoiComponent },
            { path: ':id/cap-nhat', component: SoMatCapNhatComponent },
        ]
    },
    {
        path: 'hang-hoa-nguyen-lieu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HangHoaNguyenLieuComponent },
            { path: 'them-moi', component: HangHoaNguyenLieuThemMoiComponent },
            { path: ':id/cap-nhat', component: HangHoaNguyenLieuCapNhatComponent },
        ]
    },
    {
        path: 'hang-hoa-hang-tron',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HangHoaHangTronComponent },
            { path: 'them-moi', component: HangHoaHangTronThemMoiComponent },
            { path: ':id/cap-nhat', component: HangHoaHangTronCapNhatComponent },
        ]
    },
    {
        path: 'kho-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: KhoHangComponent },
            { path: 'them-moi', component: KhoHangThemMoiComponent },
            { path: ':id/cap-nhat', component: KhoHangCapNhatComponent },
        ]
    },
    {
        path: 'danh-sach-xe',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhSachXeComponent },
            { path: 'them-moi', component: DanhSachXeThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhSachXeCapNhatComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThietLapRoutingModule { }
