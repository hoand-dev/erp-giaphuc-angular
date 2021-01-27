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
import { DanhSachHangHoaYeuCauGiaCongModalComponent } from './modals/danh-sach-hang-hoa-yeu-cau-gia-cong-modal/danh-sach-hang-hoa-yeu-cau-gia-cong-modal.component';
import { PhieuYeuCauGiaCongComponent } from './pages/phieu-yeu-cau-gia-cong/phieu-yeu-cau-gia-cong.component';
import { PhieuYeuCauGiaCongThemMoiComponent } from './pages/phieu-yeu-cau-gia-cong-them-moi/phieu-yeu-cau-gia-cong-them-moi.component';
import { PhieuYeuCauGiaCongCapNhatComponent } from './pages/phieu-yeu-cau-gia-cong-cap-nhat/phieu-yeu-cau-gia-cong-cap-nhat.component';
import { PhieuNhapKhoGiaCongComponent } from './pages/phieu-nhap-kho-gia-cong/phieu-nhap-kho-gia-cong.component';
import { PhieuNhapKhoGiaCongThemMoiComponent } from './pages/phieu-nhap-kho-gia-cong-them-moi/phieu-nhap-kho-gia-cong-them-moi.component';
import { PhieuNhapKhoGiaCongCapNhatComponent } from './pages/phieu-nhap-kho-gia-cong-cap-nhat/phieu-nhap-kho-gia-cong-cap-nhat.component';
import { DanhSachPhieuYeuCauGiaCongModalComponent } from './modals/danh-sach-phieu-yeu-cau-gia-cong-modal/danh-sach-phieu-yeu-cau-gia-cong-modal.component';
import { DanhSachLoiModalComponent } from './modals/danh-sach-loi-modal/danh-sach-loi-modal.component';
import { PhieuXuatKhoGiaCongInPhieuModalComponent } from './modals/phieu-xuat-kho-gia-cong-in-phieu-modal/phieu-xuat-kho-gia-cong-in-phieu-modal.component';
import { PhieuYeuCauGiaCongInPhieuModalComponent } from './modals/phieu-yeu-cau-gia-cong-in-phieu-modal/phieu-yeu-cau-gia-cong-in-phieu-modal.component';
import { PhieuNhapThanhPhamInPhieuModalComponent } from './modals/phieu-nhap-thanh-pham-in-phieu-modal/phieu-nhap-thanh-pham-in-phieu-modal.component';


@NgModule({
    declarations: [PhieuCapPhatVatTuComponent, PhieuCapPhatVatTuThemMoiComponent, PhieuCapPhatVatTuCapNhatComponent, BangGiaGiaCongComponent, BangGiaGiaCongThemMoiComponent, BangGiaGiaCongCapNhatComponent, PhieuXuatKhoGiaCongComponent, PhieuXuatKhoGiaCongThemMoiComponent, PhieuXuatKhoGiaCongCapNhatComponent, DanhSachHangHoaYeuCauGiaCongModalComponent, PhieuYeuCauGiaCongComponent, PhieuYeuCauGiaCongThemMoiComponent, PhieuYeuCauGiaCongCapNhatComponent, PhieuNhapKhoGiaCongComponent, PhieuNhapKhoGiaCongThemMoiComponent, PhieuNhapKhoGiaCongCapNhatComponent, DanhSachPhieuYeuCauGiaCongModalComponent, DanhSachLoiModalComponent, PhieuXuatKhoGiaCongInPhieuModalComponent, PhieuYeuCauGiaCongInPhieuModalComponent, PhieuNhapThanhPhamInPhieuModalComponent],
    imports: [
        CommonModule,
        SharedModule,
        SanXuatRoutingModule
    ]
})
export class SanXuatModule { }
