import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/modules/shared.module';
import { ThongKeRoutingModule } from './thong-ke-routing.module';
import { ThongKeCongNoQuaHanComponent } from './cong-no/pages/thong-ke-cong-no-qua-han/thong-ke-cong-no-qua-han.component';
import { ThongKeCongNoKhachHangComponent } from './cong-no/pages/thong-ke-cong-no-khach-hang/thong-ke-cong-no-khach-hang.component';
import { ThongKeNoiDungThuChiComponent } from './thu-chi/pages/thong-ke-noi-dung-thu-chi/thong-ke-noi-dung-thu-chi.component';
import { ThongKeThuChiTonQuyComponent } from './thu-chi/pages/thong-ke-thu-chi-ton-quy/thong-ke-thu-chi-ton-quy.component';
import { ThongKeCongNoNhaCungCapComponent } from './cong-no/pages/thong-ke-cong-no-nha-cung-cap/thong-ke-cong-no-nha-cung-cap.component';
import {ThongKeMuaHangChiTietComponent} from './mua-hang/pages/thong-ke-mua-hang-chi-tiet/thong-ke-mua-hang-chi-tiet.component';
import { DoiChieuCongNoKhachHangModalComponent } from './cong-no/modals/doi-chieu-cong-no-khach-hang-modal/doi-chieu-cong-no-khach-hang-modal.component';
import { DoiChieuCongNoNhaCungCapModalComponent } from './cong-no/modals/doi-chieu-cong-no-nha-cung-cap-modal/doi-chieu-cong-no-nha-cung-cap-modal.component';
import { ThongKeXuatNhapTonComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton/thong-ke-xuat-nhap-ton.component';


@NgModule({
  declarations: [ThongKeCongNoQuaHanComponent, ThongKeCongNoKhachHangComponent, ThongKeNoiDungThuChiComponent, ThongKeThuChiTonQuyComponent, ThongKeCongNoNhaCungCapComponent, ThongKeMuaHangChiTietComponent, DoiChieuCongNoKhachHangModalComponent, DoiChieuCongNoNhaCungCapModalComponent, ThongKeXuatNhapTonComponent],
  imports: [
    CommonModule,
    SharedModule,
    ThongKeRoutingModule
  ]
})
export class ThongKeModule { }
