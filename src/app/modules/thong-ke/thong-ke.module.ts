import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/modules/shared.module';
import { ThongKeRoutingModule } from './thong-ke-routing.module';
import { ThongKeCongNoQuaHanComponent } from './cong-no/pages/thong-ke-cong-no-qua-han/thong-ke-cong-no-qua-han.component';
import { ThongKeCongNoKhachHangComponent } from './cong-no/pages/thong-ke-cong-no-khach-hang/thong-ke-cong-no-khach-hang.component';
import { ThongKeNoiDungThuChiComponent } from './thu-chi/pages/thong-ke-noi-dung-thu-chi/thong-ke-noi-dung-thu-chi.component';
import { ThongKeThuChiTonQuyComponent } from './thu-chi/pages/thong-ke-thu-chi-ton-quy/thong-ke-thu-chi-ton-quy.component';
import { ThongKeCongNoNhaCungCapComponent } from './cong-no/pages/thong-ke-cong-no-nha-cung-cap/thong-ke-cong-no-nha-cung-cap.component';
import { ThongKeMuaHangChiTietComponent } from './mua-hang/pages/thong-ke-mua-hang-chi-tiet/thong-ke-mua-hang-chi-tiet.component';
import { DoiChieuCongNoKhachHangModalComponent } from './cong-no/modals/doi-chieu-cong-no-khach-hang-modal/doi-chieu-cong-no-khach-hang-modal.component';
import { DoiChieuCongNoNhaCungCapModalComponent } from './cong-no/modals/doi-chieu-cong-no-nha-cung-cap-modal/doi-chieu-cong-no-nha-cung-cap-modal.component';
import { ThongKeXuatNhapTonComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton/thong-ke-xuat-nhap-ton.component';
import { ThongKeXuatNhapTonChiTietPhieuModalComponent } from './kho-hang/modals/thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal/thong-ke-xuat-nhap-ton-chi-tiet-phieu-modal.component';
import { ThongKeXuatNhapTonChiTietModalComponent } from './kho-hang/modals/thong-ke-xuat-nhap-ton-chi-tiet-modal/thong-ke-xuat-nhap-ton-chi-tiet-modal.component';
import { ThongKeXuatNhapTonTrongNgayComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton-trong-ngay/thong-ke-xuat-nhap-ton-trong-ngay.component';
import { ThongKeCongNoDonViGiaCongComponent } from './cong-no/pages/thong-ke-cong-no-don-vi-gia-cong/thong-ke-cong-no-don-vi-gia-cong.component';
import { DoiChieuCongNoDonViGiaCongModalComponent } from './cong-no/modals/doi-chieu-cong-no-don-vi-gia-cong-modal/doi-chieu-cong-no-don-vi-gia-cong-modal.component';
import { ThongKeBanHangChiTietComponent } from './ban-hang/pages/thong-ke-ban-hang-chi-tiet/thong-ke-ban-hang-chi-tiet.component';
import { ThongKeXuatBanChiTietComponent } from './ban-hang/pages/thong-ke-xuat-ban-chi-tiet/thong-ke-xuat-ban-chi-tiet.component';
import { KhachHangChiTietCongNoModalComponent } from './cong-no/modals/khach-hang-chi-tiet-cong-no-modal/khach-hang-chi-tiet-cong-no-modal.component';
import { NhaCungCapChiTietCongNoModalComponent } from './cong-no/modals/nha-cung-cap-chi-tiet-cong-no-modal/nha-cung-cap-chi-tiet-cong-no-modal.component';
import { DonViGiaCongChiTietCongNoModalComponent } from './cong-no/modals/don-vi-gia-cong-chi-tiet-cong-no-modal/don-vi-gia-cong-chi-tiet-cong-no-modal.component';
import { ThongKeChiTietTonQuyModalComponent } from './thu-chi/modals/thong-ke-chi-tiet-ton-quy-modal/thong-ke-chi-tiet-ton-quy-modal.component';
import { ThongKeThuChiTonQuyTongHopModalComponent } from './thu-chi/modals/thong-ke-thu-chi-ton-quy-tong-hop-modal/thong-ke-thu-chi-ton-quy-tong-hop-modal.component';

@NgModule({
    declarations: [
        ThongKeCongNoQuaHanComponent,
        ThongKeCongNoKhachHangComponent,
        ThongKeNoiDungThuChiComponent,
        ThongKeThuChiTonQuyComponent,
        ThongKeCongNoNhaCungCapComponent,
        ThongKeMuaHangChiTietComponent,
        DoiChieuCongNoKhachHangModalComponent,
        DoiChieuCongNoNhaCungCapModalComponent,
        ThongKeXuatNhapTonComponent,
        ThongKeXuatNhapTonChiTietPhieuModalComponent,
        ThongKeXuatNhapTonChiTietModalComponent,
        ThongKeXuatNhapTonTrongNgayComponent,
        ThongKeCongNoDonViGiaCongComponent,
        DoiChieuCongNoDonViGiaCongModalComponent,
        ThongKeBanHangChiTietComponent,
        ThongKeXuatBanChiTietComponent,
        KhachHangChiTietCongNoModalComponent,
        NhaCungCapChiTietCongNoModalComponent,
        DonViGiaCongChiTietCongNoModalComponent,
        ThongKeChiTietTonQuyModalComponent,
        ThongKeThuChiTonQuyTongHopModalComponent
    ],
    imports: [CommonModule, SharedModule, ThongKeRoutingModule]
})
export class ThongKeModule {}
