import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/_helpers';
import { ThongKeBanHangChiTietComponent } from './ban-hang/pages/thong-ke-ban-hang-chi-tiet/thong-ke-ban-hang-chi-tiet.component';
import { ThongKeXuatBanChiTietComponent } from './ban-hang/pages/thong-ke-xuat-ban-chi-tiet/thong-ke-xuat-ban-chi-tiet.component';
import { ThongKeCongNoDonViGiaCongComponent } from './cong-no/pages/thong-ke-cong-no-don-vi-gia-cong/thong-ke-cong-no-don-vi-gia-cong.component';
import { ThongKeCongNoKhachHangComponent } from './cong-no/pages/thong-ke-cong-no-khach-hang/thong-ke-cong-no-khach-hang.component';
import { ThongKeCongNoNhaCungCapComponent } from './cong-no/pages/thong-ke-cong-no-nha-cung-cap/thong-ke-cong-no-nha-cung-cap.component';
import { ThongKeCongNoQuaHanComponent } from './cong-no/pages/thong-ke-cong-no-qua-han/thong-ke-cong-no-qua-han.component';
import { ThongKeMuonNgoaiComponent } from './kho-hang/pages/thong-ke-muon-ngoai/thong-ke-muon-ngoai.component';
import { ThongKeXuatMuonComponent } from './kho-hang/pages/thong-ke-xuat-muon/thong-ke-xuat-muon.component';
import { ThongKeXuatNhapTonLoHangComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton-lo-hang/thong-ke-xuat-nhap-ton-lo-hang.component';
import { ThongKeXuatNhapTonTrongNgayComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton-trong-ngay/thong-ke-xuat-nhap-ton-trong-ngay.component';
import { ThongKeXuatNhapTonComponent } from './kho-hang/pages/thong-ke-xuat-nhap-ton/thong-ke-xuat-nhap-ton.component';
import { ThongKeMuaHangChiTietComponent } from './mua-hang/pages/thong-ke-mua-hang-chi-tiet/thong-ke-mua-hang-chi-tiet.component';
import { ThongKeTinhHinhSanXuatDonHangComponent } from './san-xuat/pages/thong-ke-tinh-hinh-san-xuat-don-hang/thong-ke-tinh-hinh-san-xuat-don-hang.component';
import { ThongKeTinhHinhXuatKhoDonHangComponent } from './san-xuat/pages/thong-ke-tinh-hinh-xuat-kho-don-hang/thong-ke-tinh-hinh-xuat-kho-don-hang.component';
import { ThongKeTyLeHangLoiComponent } from './san-xuat/pages/thong-ke-ty-le-hang-loi/thong-ke-ty-le-hang-loi.component';
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
            { path: 'xuat-nhap-ton-lo-hang', component: ThongKeXuatNhapTonLoHangComponent },
            { path: 'xuat-nhap-ton', component: ThongKeXuatNhapTonComponent },
            { path: 'hang-xuat-muon', component: ThongKeXuatMuonComponent },
            { path: 'hang-nhap-muon-ngoai', component: ThongKeMuonNgoaiComponent },

            /* nhóm thống kê mua hàng */
            { path: 'mua-hang-chi-tiet', component: ThongKeMuaHangChiTietComponent },

            /* nhóm thống kê bán hàng */
            { path: 'ban-hang-chi-tiet', component: ThongKeBanHangChiTietComponent },
            { path: 'xuat-ban-hang-chi-tiet', component: ThongKeXuatBanChiTietComponent },

            /* nhóm thống kê sản xuất */
            { path: 'tinh-hinh-san-xuat', component: ThongKeTinhHinhSanXuatDonHangComponent },
            { path: 'tinh-hinh-xuat-kho', component: ThongKeTinhHinhXuatKhoDonHangComponent },
            { path: 'ty-le-hang-loi', component: ThongKeTyLeHangLoiComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThongKeRoutingModule { }
