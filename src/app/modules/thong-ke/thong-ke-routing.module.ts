import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { ThongKeBanHangChiTietComponent } from './ban-hang/pages/thong-ke-ban-hang-chi-tiet/thong-ke-ban-hang-chi-tiet.component';
import { ThongKeCongNoDonViGiaCongComponent } from './cong-no/pages/thong-ke-cong-no-don-vi-gia-cong/thong-ke-cong-no-don-vi-gia-cong.component';
import { ThongKeCongNoKhachHangComponent } from './cong-no/pages/thong-ke-cong-no-khach-hang/thong-ke-cong-no-khach-hang.component';
import { ThongKeCongNoNhaCungCapComponent } from './cong-no/pages/thong-ke-cong-no-nha-cung-cap/thong-ke-cong-no-nha-cung-cap.component';
import { ThongKeCongNoQuaHanComponent } from './cong-no/pages/thong-ke-cong-no-qua-han/thong-ke-cong-no-qua-han.component';
import { ThongKeXuatNhapTonTrongNgayComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton-trong-ngay/thong-ke-xuat-nhap-ton-trong-ngay.component';
import { ThongKeXuatNhapTonComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton/thong-ke-xuat-nhap-ton.component';
import { ThongKeMuaHangChiTietComponent } from './mua-hang/pages/thong-ke-mua-hang-chi-tiet/thong-ke-mua-hang-chi-tiet.component';
import { ThongKeNoiDungThuChiComponent } from './thu-chi/pages/thong-ke-noi-dung-thu-chi/thong-ke-noi-dung-thu-chi.component';
import { ThongKeThuChiTonQuyComponent } from './thu-chi/pages/thong-ke-thu-chi-ton-quy/thong-ke-thu-chi-ton-quy.component';

const routes: Routes = [
    {
        path: 'thong-ke',
        canActivate: [AuthGuard],
        children: [
            /* nhóm thống kê công nợ */
            { path: 'cong-no-qua-han', component: ThongKeCongNoQuaHanComponent },
            { path: 'cong-no-khach-hang', component: ThongKeCongNoKhachHangComponent },
            { path: 'cong-no-nha-cung-cap', component: ThongKeCongNoNhaCungCapComponent },
            { path: 'cong-no-don-vi-gia-cong', component: ThongKeCongNoDonViGiaCongComponent },
            
            /* nhóm thống kê thu chi */
            { path: 'thu-chi-noi-dung', component: ThongKeNoiDungThuChiComponent },
            { path: 'thu-chi-ton-quy', component: ThongKeThuChiTonQuyComponent },

            /* nhóm thống kê kho */
            { path: 'xuat-nhap-ton-trong-ngay', component: ThongKeXuatNhapTonTrongNgayComponent },
            { path: 'xuat-nhap-ton', component: ThongKeXuatNhapTonComponent },

            /* nhóm thống kê mua hàng */
            { path: 'mua-hang-chi-tiet', component: ThongKeMuaHangChiTietComponent },

            /* nhóm thống kê bán hàng */
            { path: 'ban-hang-chi-tiet', component: ThongKeBanHangChiTietComponent },

        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThongKeRoutingModule { }
