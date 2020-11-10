import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_helpers';
import {
    ChiNhanhComponent,
    ChiNhanhThemMoiComponent,
    ChiNhanhCapNhatComponent,
    DanhMucGiaCongComponent,
    DanhMucGiaCongThemMoiComponent,
    DanhMucGiaCongCapNhatComponent,
    DanhMucLoiComponent,
    DanhMucLoiThemMoiComponent,
    DanhMucLoiCapNhatComponent,
    DanhMucNoComponent,
    DanhMucNoThemMoiComponent,
    DanhMucNoCapNhatComponent,
    DanhMucTieuChuanComponent,
    DanhMucTieuChuanThemMoiComponent,
    DanhMucTieuChuanCapNhatComponent,
    DonViGiaCongComponent,
    DonViGiaCongThemMoiComponent,
    DonViGiaCongCapNhatComponent,
    DonViTinhComponent,
    DonViTinhThemMoiComponent,
    DonViTinhCapNhatComponent,
    NguonNhanLucComponent,
    NguonNhanLucThemMoiComponent,
    NguonNhanLucCapNhatComponent,
    NoiDungThuChiComponent,
    NoiDungThuChiThemMoiComponent,
    NoiDungThuChiCapNhatComponent,
    QuyTaiKhoanComponent,
    QuyTaiKhoanThemMoiComponent,
    QuyTaiKhoanCapNhatComponent,
    SoMatComponent,
    SoMatThemMoiComponent,
    SoMatCapNhatComponent,
    HangHoaNguyenLieuComponent,
    HangHoaNguyenLieuThemMoiComponent,
    HangHoaNguyenLieuCapNhatComponent,
    HangHoaHangTronComponent,
    HangHoaHangTronThemMoiComponent,
    HangHoaHangTronCapNhatComponent,
    DinhMucComponent,
    DinhMucThemMoiComponent,
    DinhMucCapNhatComponent,
    HangHoaThanhPhamComponent,
    HangHoaThanhPhamThemMoiComponent,
    HangHoaThanhPhamCapNhatComponent,
    KhoHangComponent,
    KhoHangThemMoiComponent,
    KhoHangCapNhatComponent,
    DanhSachXeComponent,
    DanhSachXeThemMoiComponent,
    DanhSachXeCapNhatComponent,
    TaiXeComponent,
    TaiXeThemMoiComponent,
    TaiXeCapNhatComponent,
    LoaiHangComponent,
    LoaiHangThemMoiComponent,
    LoaiHangCapNhatComponent,
    KhuVucComponent,
    KhuVucThemMoiComponent,
    KhuVucCapNhatComponent
} from './pages';

const routes: Routes = [
    {
        path: 'chi-nhanh',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: ChiNhanhComponent },
            { path: 'them-moi', component: ChiNhanhThemMoiComponent },
            { path: ':id/cap-nhat', component: ChiNhanhCapNhatComponent }
        ]
    },
    {
        path: 'danh-muc-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucGiaCongComponent },
            { path: 'them-moi', component: DanhMucGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucGiaCongCapNhatComponent }
        ]
    },
    {
        path: 'danh-muc-loi',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucLoiComponent },
            { path: 'them-moi', component: DanhMucLoiThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucLoiCapNhatComponent }
        ]
    },
    {
        path: 'danh-muc-no',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucNoComponent },
            { path: 'them-moi', component: DanhMucNoThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucNoCapNhatComponent }
        ]
    },
    {
        path: 'danh-muc-tieu-chuan',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhMucTieuChuanComponent },
            { path: 'them-moi', component: DanhMucTieuChuanThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhMucTieuChuanCapNhatComponent }
        ]
    },
    {
        path: 'don-vi-gia-cong',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DonViGiaCongComponent },
            { path: 'them-moi', component: DonViGiaCongThemMoiComponent },
            { path: ':id/cap-nhat', component: DonViGiaCongCapNhatComponent }
        ]
    },
    {
        path: 'don-vi-tinh',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DonViTinhComponent },
            { path: 'them-moi', component: DonViTinhThemMoiComponent },
            { path: ':id/cap-nhat', component: DonViTinhCapNhatComponent }
        ]
    },
    {
        path: 'nguon-nhan-luc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: NguonNhanLucComponent },
            { path: 'them-moi', component: NguonNhanLucThemMoiComponent },
            { path: ':id/cap-nhat', component: NguonNhanLucCapNhatComponent }
        ]
    },
    {
        path: 'noi-dung-thu-chi',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: NoiDungThuChiComponent },
            { path: 'them-moi', component: NoiDungThuChiThemMoiComponent },
            { path: ':id/cap-nhat', component: NoiDungThuChiCapNhatComponent }
        ]
    },
    {
        path: 'quy-tai-khoan',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: QuyTaiKhoanComponent },
            { path: 'them-moi', component: QuyTaiKhoanThemMoiComponent },
            { path: ':id/cap-nhat', component: QuyTaiKhoanCapNhatComponent }
        ]
    },
    {
        path: 'so-mat',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: SoMatComponent },
            { path: 'them-moi', component: SoMatThemMoiComponent },
            { path: ':id/cap-nhat', component: SoMatCapNhatComponent }
        ]
    },
    {
        path: 'hang-hoa-nguyen-lieu',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HangHoaNguyenLieuComponent },
            { path: 'them-moi', component: HangHoaNguyenLieuThemMoiComponent },
            { path: ':id/cap-nhat', component: HangHoaNguyenLieuCapNhatComponent }
        ]
    },
    {
        path: 'hang-hoa-hang-tron',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HangHoaHangTronComponent },
            { path: 'them-moi', component: HangHoaHangTronThemMoiComponent },
            { path: ':id/cap-nhat', component: HangHoaHangTronCapNhatComponent }
        ]
    },
    {
        path: 'dinh-muc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DinhMucComponent },
            { path: 'them-moi', component: DinhMucThemMoiComponent },
            { path: ':id/cap-nhat', component: DinhMucCapNhatComponent }
        ]
    },
    {
        path: 'hang-hoa-thanh-pham',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HangHoaThanhPhamComponent },
            { path: 'them-moi', component: HangHoaThanhPhamThemMoiComponent },
            { path: ':id/cap-nhat', component: HangHoaThanhPhamCapNhatComponent }
        ]
    },
    {
        path: 'kho-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: KhoHangComponent },
            { path: 'them-moi', component: KhoHangThemMoiComponent },
            { path: ':id/cap-nhat', component: KhoHangCapNhatComponent }
        ]
    },
    {
        path: 'danh-sach-xe',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DanhSachXeComponent },
            { path: 'them-moi', component: DanhSachXeThemMoiComponent },
            { path: ':id/cap-nhat', component: DanhSachXeCapNhatComponent }
        ]
    },
    {
        path: 'tai-xe',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: TaiXeComponent },
            { path: 'them-moi', component: TaiXeThemMoiComponent },
            { path: ':id/cap-nhat', component: TaiXeCapNhatComponent }
        ]
    },
    {
        path: 'loai-hang',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: LoaiHangComponent },
            { path: 'them-moi', component: LoaiHangThemMoiComponent },
            { path: ':id/cap-nhat', component: LoaiHangCapNhatComponent }
        ]
    },
    {
        path: 'khu-vuc',
        canActivate: [AuthGuard],
        children: [
            { path: '', component: KhuVucComponent },
            { path: 'them-moi', component: KhuVucThemMoiComponent },
            { path: ':id/cap-nhat', component: KhuVucCapNhatComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThietLapRoutingModule {}
