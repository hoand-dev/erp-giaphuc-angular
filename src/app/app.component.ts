import { Component, HostBinding, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import DataSource from 'devextreme/data/data_source';

import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';

import { ChiNhanh } from './shared/entities';
import { ChiNhanhService, CommonService, Ipv4Service, NguoiDungService } from './shared/services';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    /* để dành cho version sau này nha :)) */
    menuGroups: string[] = [];
    currentMenu: any[] = [];

    currentUserToken: User;
    currentUser: User = new User();

    chinhanhs: ChiNhanh[] = [];
    
    bsModalRef: BsModalRef;
    fisrtRefreshToken: boolean = true;

    ipv4: string = null;

    /* themes */
    navbar_dark_skins = [
        'navbar-primary',
        'navbar-secondary',
        'navbar-info',
        'navbar-success',
        'navbar-danger',
        'navbar-indigo',
        'navbar-purple',
        'navbar-pink',
        'navbar-navy',
        'navbar-lightblue',
        'navbar-teal',
        'navbar-cyan',
        'navbar-dark',
        'navbar-gray-dark',
        'navbar-gray',
        'navbar-lime',
    ]

    navbar_light_skins = [
        'navbar-light',
        'navbar-warning',
        'navbar-white',
        'navbar-orange',
    ]

    sidebar_skins = [
        'sidebar-dark-primary',
        'sidebar-dark-warning',
        'sidebar-dark-info',
        'sidebar-dark-danger',
        'sidebar-dark-success',
        'sidebar-dark-indigo',
        'sidebar-dark-lightblue',
        'sidebar-dark-navy',
        'sidebar-dark-purple',
        'sidebar-dark-fuchsia',
        'sidebar-dark-pink',
        'sidebar-dark-maroon',
        'sidebar-dark-orange',
        'sidebar-dark-lime',
        'sidebar-dark-teal',
        'sidebar-dark-olive',
        'sidebar-light-primary',
        'sidebar-light-warning',
        'sidebar-light-info',
        'sidebar-light-danger',
        'sidebar-light-success',
        'sidebar-light-indigo',
        'sidebar-light-lightblue',
        'sidebar-light-navy',
        'sidebar-light-purple',
        'sidebar-light-fuchsia',
        'sidebar-light-pink',
        'sidebar-light-maroon',
        'sidebar-light-orange',
        'sidebar-light-lime',
        'sidebar-light-teal',
        'sidebar-light-olive'
    ]

    sidebar_colors = [
        'bg-primary',
        'bg-warning',
        'bg-info',
        'bg-danger',
        'bg-success',
        'bg-indigo',
        'bg-lightblue',
        'bg-navy',
        'bg-purple',
        'bg-fuchsia',
        'bg-pink',
        'bg-maroon',
        'bg-orange',
        'bg-lime',
        'bg-teal',
        'bg-olive'
    ]

    accent_colors = [
        'accent-primary',
        'accent-warning',
        'accent-info',
        'accent-danger',
        'accent-success',
        'accent-indigo',
        'accent-lightblue',
        'accent-navy',
        'accent-purple',
        'accent-fuchsia',
        'accent-pink',
        'accent-maroon',
        'accent-orange',
        'accent-lime',
        'accent-teal',
        'accent-olive'
    ]

    navbar_all_colors = this.navbar_dark_skins.concat(this.navbar_light_skins);

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();

    private refreshInterval: any;
    public notifyChiNhanh: boolean;
    public chinhanhSelected: ChiNhanh;

    constructor(
        public router: Router,
        private commonService: CommonService,
        public authenticationService: AuthenticationService,
        private chinhanhService: ChiNhanhService,
        private nguoidungService: NguoiDungService,
        private ipv4Service: Ipv4Service,
        private modalService: BsModalService
    ) {

    }

    ngOnInit(): void {
        this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUserToken = x));
        this.notifyChiNhanh = false;

        if (localStorage.getItem("app_vrsion") != environment.version) {
            localStorage.setItem("app_vrsion", environment.version);
            this.logout();
            location.reload();
        }

        if (localStorage.getItem("app_logindate") != moment().format("YYYYMMDD")) {
            localStorage.setItem("app_logindate", moment().format("YYYYMMDD"));
            this.logout();
            location.reload();
        }

        if (this.isAutorized()) {
            // phải refresh token trước khi lấy thông tin người dùng
            /* if (this.fisrtRefreshToken){
                console.log("refresh token...");
                this.fisrtRefreshToken = false;
                this.refreshAuthToken();
            } */
            this.subscriptions.add(this.nguoidungService.getCurrentUser().subscribe(x =>
                this.currentUser = x
            ));
            this.subscriptions.add(this.chinhanhService.findChiNhanhs().subscribe(
                data => {
                    this.chinhanhs = data;
                    this.subscriptions.add(
                        this.authenticationService.currentChiNhanh.subscribe((x) => {
                            if(x.id){
                                this.chinhanhSelected = data.find(c => c.id == x.id);
                            }
                        })
                    );
                },
                error => {
                    this.chinhanhService.handleError(error);
                }
            ));
            /* để dành cho version sau này nha :)) */
            this.subscriptions.add(this.commonService.timKiem_Menu().subscribe(x =>
                {
                    this.currentMenu = x;
                    x.forEach(e => {
                        if(!this.menuGroups.includes(e.groupclass) && e.groupclass != null){
                            this.menuGroups.push(e.groupclass);
                        }
                    });
                }
            ));
            setInterval(() => {
                console.log("interval refresh token...");
                this.refreshAuthToken();
            }, 1000 * 60 * 60 * 4);

            this.subscriptions.add(
                this.ipv4Service.ip().subscribe(
                    (data) => {
                        this.ipv4 = data.query;
                        if (this.ipv4) {
                            this.ipv4Service.updateOnline(this.ipv4).toPromise();
                            // setInterval(() => {
                            //     this.ipv4Service.updateOnline(this.ipv4).toPromise();
                            // }, 1000 * 60 * 60);
                        }
                    },
                    (error) => {
                        this.ipv4Service.handleError(error);
                    }
                )
            );
        }
    }

    refreshAuthToken(){
        this.authenticationService.refreshAuthToken().pipe(first())
            .subscribe({
                next: () => {

                },
                error: error => {
                    // kiểm tra lỗi nếu hết phiên làm việc -> thông báo -> chuyển đến trang đăng nhập
                }
            });
    }

    onChangePassword(){
       /* khởi tạo giá trị cho modal */
       const initialState = {
            title: 'THAY ĐỔI MẬT KHẨU'
        };

        /* hiển thị modal */
        this.bsModalRef = this.modalService.show(ChangePasswordComponent, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true, keyboard: false, initialState });
        this.bsModalRef.content.closeBtnName = 'Đóng';
    }
    
    /* để dành cho version sau này nha :)) */
    existGroupMenu(group: string){
        return this.menuGroups.includes(group);
    }

    activeGroupClass(groupName: string = null){
        const DULIEUCOSO = [
            "/chi-nhanh", 
            "/danh-muc-no",
            "/khu-vuc",
            "/don-vi-gia-cong",
            "/noi-dung-thu-chi",
            "/quy-tai-khoan",
            "/kho-hang",
            "/danh-sach-xe",
            "/nguon-nhan-luc",
            "/tai-xe",
            "/nguon-nhan-luc",
            "/khu-vuc",
        ];
        const KHACHHANG = [
            "/nhom-khach-hang",
            "/khach-hang",
        ];
        const NHACUNGCAP = [
            "/nhom-nha-cung-cap",
            "/nha-cung-cap",
        ];
        const HANGHOA = [
            "/danh-muc-gia-cong",
            "/danh-muc-loi",
            "/danh-muc-tieu-chuan",
            "/loai-hang",
            "/don-vi-tinh",
            "/so-mat",
            "/hang-hoa-nguyen-lieu",
            "/hang-hoa-hang-tron",
            "/dinh-muc",
            "/hang-hoa-thanh-pham",
        ];
        const SANXUAT = [
            "/bang-gia-gia-cong",
            "/phieu-xuat-kho-gia-cong",
            "/phieu-yeu-cau-gia-cong",
            "/phieu-nhap-kho-gia-cong",
            "/phieu-cap-phat-vat-tu",
        ];
        const MUAHANG = [
            "/phieu-dat-hang-ncc",
            "/phieu-mua-hang-ncc",
            "/phieu-tra-hang-ncc",
        ];
        const BANHANG = [
            "/theo-doi-hop-dong",
            "/bang-gia", 
            "/phieu-dat-hang", 
            "/phieu-ban-hang", 
            "/phieu-khach-tra-hang", 
        ];
        const KHOHANG = [
            "/phieu-nhap-kho", 
            "/phieu-xuat-kho", 
            "/phieu-dieu-chinh-kho", 
            "/phieu-xuat-chuyen-kho", 
            "/phieu-nhap-chuyen-kho",
        ];
        const MUONHANG = [
            "/phieu-xuat-muon-hang",
            "/phieu-nhap-tra-muon-hang",
            "/phieu-nhap-muon-hang",
            "/phieu-xuat-tra-muon-hang",
        ];
        const KETOAN = [
            "/lenh-vay",
            "/phieu-thu", 
            "/phieu-chi", 
            "/phieu-can-tru", 
        ];
        const THONGKE_KHOHANG =[
            "/xuat-nhap-ton-trong-ngay",
            "/xuat-nhap-ton",
            "/hang-xuat-muon",
            "/hang-nhap-muon-ngoai"
        ];
        const THONGKE_CONGNO = [
            "/cong-no-qua-han",
            "/cong-no-khach-hang",
            "/cong-no-nha-cung-cap",
            "/cong-no-don-vi-gia-cong",
        ];
        const THONGKE_THUCHI = [
            "/thu-chi-noi-dung",
            "/thu-chi-ton-quy",
        ];
        const THONGKE_MUAHANG = [
            "/mua-hang-chi-tiet"
        ];
        const THONGKE_BANHANG = [
            "/ban-hang-chi-tiet",
            "/xuat-ban-hang-chi-tiet",
        ];
        const HETHONG = [
            "/nguoi-dung",
            "/he-thong/lich-su",
        ];
        
        /* xử lý chuỗi url */
        function indexOf(string, sub, index) {
            if (index <= 1){
                return string.indexOf(sub);
            }
            return string.split(sub, index).join(sub).length;
        }

        let $return = false;
        let $url = this.router.url.replace("/thong-ke", "");
        let $indexSecond = indexOf($url, '/', 2);
        $url = $url.substring(0, $indexSecond);

        /* kiểm tra chuỗi đã xử lý */
        switch (groupName) {
            case 'DULIEUCOSO'     : $return = DULIEUCOSO     .includes($url); break;
            case 'KHACHHANG'      : $return = KHACHHANG      .includes($url); break;
            case 'NHACUNGCAP'     : $return = NHACUNGCAP     .includes($url); break;
            case 'HANGHOA'        : $return = HANGHOA        .includes($url); break;
            case 'SANXUAT'        : $return = SANXUAT        .includes($url); break;
            case 'MUAHANG'        : $return = MUAHANG        .includes($url); break;
            case 'BANHANG'        : $return = BANHANG        .includes($url); break;
            case 'KHOHANG'        : $return = KHOHANG        .includes($url); break;
            case 'MUONHANG'       : $return = MUONHANG       .includes($url); break;
            case 'KETOAN'         : $return = KETOAN         .includes($url); break;
            case 'THONGKE-KHOHANG': $return = THONGKE_KHOHANG.includes($url); break;
            case 'THONGKE-CONGNO' : $return = THONGKE_CONGNO .includes($url); break;
            case 'THONGKE-THUCHI' : $return = THONGKE_THUCHI .includes($url); break;
            case 'THONGKE-MUAHANG': $return = THONGKE_MUAHANG.includes($url); break;
            case 'THONGKE-BANHANG': $return = THONGKE_BANHANG.includes($url); break;
            case 'HETHONG'        : $return = HETHONG        .includes($url); break;
            default: $return = false; break;
        }
        return $return;
    }
    
    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        setTimeout(() => {
            /* the interface of user */
            // check no border header check box
            if (localStorage.getItem("no_border_checkbox") == 'true') {
                $('.main-header').addClass('border-bottom-0')
                this.$no_border_checkbox = true;
            }
            else {
                $('.main-header').removeClass('border-bottom-0')
                this.$no_border_checkbox = false;
            }

            // check small text body check box
            if (localStorage.getItem('text_sm_body_checkbox') == 'true') {
                $('body').addClass('text-sm')
                this.$text_sm_body_checkbox = true;
            }
            else {
                $('body').removeClass('text-sm')
                this.$text_sm_body_checkbox = false;
            }

            // check header sm text check box
            if (localStorage.getItem('text_sm_header_checkbox') == 'true') {
                $('.main-header').addClass('text-sm')
                this.$text_sm_header_checkbox = true;
            } else {
                $('.main-header').removeClass('text-sm')
                this.$text_sm_header_checkbox = false;
            }

            // check side bar small text check box
            if (localStorage.getItem('text_sm_sidebar_checkbox') == 'true') {
                $('.nav-sidebar').addClass('text-sm')
                this.$text_sm_sidebar_checkbox = true;
            }
            else {
                $('.nav-sidebar').removeClass('text-sm')
                this.$text_sm_sidebar_checkbox = false;
            }

            // check footer small text check box
            if (localStorage.getItem('text_sm_footer_checkbox') == 'true') {
                $('.main-footer').addClass('text-sm')
                this.$text_sm_footer_checkbox = true;
            }
            else {
                $('.main-footer').removeClass('text-sm')
                this.$text_sm_footer_checkbox = false;
            }

            // check flat sidebar check box
            if (localStorage.getItem('flat_sidebar_checkbox') == 'true') {
                $('.nav-sidebar').addClass('nav-flat')
                this.$flat_sidebar_checkbox = true;
            }
            else {
                $('.nav-sidebar').removeClass('nav-flat')
                this.$flat_sidebar_checkbox = false;
            }

            // check legacy
            if (localStorage.getItem('legacy_sidebar_checkbox') == 'true') {
                $('.nav-sidebar').addClass('nav-legacy')
                this.$legacy_sidebar_checkbox = true;
            }
            else {
                $('.nav-sidebar').removeClass('nav-legacy')
                this.$legacy_sidebar_checkbox = false;
            }

            // check compact
            if (localStorage.getItem('compact_sidebar_checkbox') == 'true') {
                $('.nav-sidebar').addClass('nav-compact')
                this.$compact_sidebar_checkbox = true;
            }
            else {
                $('.nav-sidebar').removeClass('nav-compact')
                this.$compact_sidebar_checkbox = false;
            }

            // check child
            if (localStorage.getItem('child_indent_sidebar_checkbox') == 'true') {
                $('.nav-sidebar').addClass('nav-child-indent')
                this.$child_indent_sidebar_checkbox = true;
            }
            else {
                $('.nav-sidebar').removeClass('nav-child-indent')
                this.$child_indent_sidebar_checkbox = false;
            }

            // check sidebar no expand
            if (localStorage.getItem('no_expand_sidebar_checkbox') == 'true') {
                $('.main-sidebar').addClass('sidebar-no-expand')
                this.$no_expand_sidebar_checkbox = true;
            }
            else {
                $('.main-sidebar').removeClass('sidebar-no-expand')
                this.$no_expand_sidebar_checkbox = false;
            }

            // navbar_variants_colors
            if (localStorage.getItem('navbar_variants_colors') != null) {
                var color = localStorage.getItem('navbar_variants_colors') // $(this).data('color')
                var $main_header = $('.main-header')
                $main_header.removeClass('navbar-dark').removeClass('navbar-light')
                this.navbar_all_colors.map(function (color) {
                    $main_header.removeClass(color)
                })

                if (this.navbar_dark_skins.indexOf(color) > -1) {
                    $main_header.addClass('navbar-dark')
                } else {
                    $main_header.addClass('navbar-light')
                }

                $main_header.addClass(color)
            }

            // accent_variants_color
            if (localStorage.getItem('accent_variants_color') != null) {
                var color = localStorage.getItem('accent_variants_color') // $(this).data('color')
                var accent_class = color
                var $body = $('body')
                this.accent_colors.map(function (skin) {
                    $body.removeClass(skin)
                })

                $body.addClass(accent_class)
            }

            // sidebar_variants_color
            if (localStorage.getItem('sidebar_variants_color') != null) {
                var color = localStorage.getItem('sidebar_variants_color') // $(this).data('color')
                var sidebar_class = color //'sidebar-dark-' + color.replace('bg-', '')
                var $sidebar = $('.main-sidebar')
                this.sidebar_skins.map(function (skin) {
                    $sidebar.removeClass(skin)
                })

                $sidebar.addClass(sidebar_class)
            }

            /* // sidebar_variants_color
            if (localStorage.getItem('sidebar_variants_color') != null) {
                var color = localStorage.getItem('sidebar_variants_color')// $(this).data('color')
                var sidebar_class = color // 'sidebar-light-' + color.replace('bg-', '')
                var $sidebar = $('.main-sidebar')
                this.sidebar_skins.map(function (skin) {
                    $sidebar.removeClass(skin)
                })
    
                $sidebar.addClass(sidebar_class)
            } */

            // remember toggle sidebar
            if (Boolean(sessionStorage.getItem("sidebar-toggle-collapsed"))) {
                $("body").addClass('sidebar-collapse')
            }
        }, 500);
    }

    onChangedChiNhanh(e) {
        // thay đổi giá trị chi nhánh hiện tại
        this.authenticationService.setChiNhanhValue(e.selectedItem);

        // thông báo cho người dùng biết
        if (this.notifyChiNhanh) {
            Swal.fire({
                title: 'ĐANG CHUYỂN CHI NHÁNH',
                html: 'Vui lòng chờ một lát ..',
                icon: 'warning',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                allowOutsideClick: false
            });
        }
        else this.notifyChiNhanh = true;
    }

    onValueChanged(e){

    }
    
    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    isAutorized() {
        return this.currentUserToken ? true : false;
    }

    $no_border_checkbox: boolean = false;
    onClickNoNarbarBoder() {
        this.$no_border_checkbox = !this.$no_border_checkbox;
        if (this.$no_border_checkbox) {
            $('.main-header').addClass('border-bottom-0')
            localStorage.setItem("no_border_checkbox", "true");
        } else {
            $('.main-header').removeClass('border-bottom-0')
            localStorage.setItem("no_border_checkbox", "false");
        }
    }

    $text_sm_body_checkbox: boolean = false;
    onClickTextSmBody() {
        this.$text_sm_body_checkbox = !this.$text_sm_body_checkbox;
        if (this.$text_sm_body_checkbox) {
            $('body').addClass('text-sm')
            localStorage.setItem('text_sm_body_checkbox', "true");
        } else {
            $('body').removeClass('text-sm')
            localStorage.setItem('text_sm_body_checkbox', "false");
        }
    }

    $text_sm_header_checkbox: boolean = false;
    onText_sm_header_checkbox() {
        this.$text_sm_header_checkbox = !this.$text_sm_header_checkbox;
        if (this.$text_sm_header_checkbox) {
            $('.main-header').addClass('text-sm')
            localStorage.setItem('text_sm_header_checkbox', "true")
        } else {
            $('.main-header').removeClass('text-sm')
            localStorage.setItem('text_sm_header_checkbox', "false")
        }
    }

    $text_sm_sidebar_checkbox: boolean = false;
    onText_sm_sidebar_checkbox() {
        this.$text_sm_sidebar_checkbox = !this.$text_sm_sidebar_checkbox;
        if (this.$text_sm_sidebar_checkbox) {
            $('.nav-sidebar').addClass('text-sm')
            localStorage.setItem('text_sm_sidebar_checkbox', "true")
        } else {
            $('.nav-sidebar').removeClass('text-sm')
            localStorage.setItem('text_sm_sidebar_checkbox', "false")
        }
    }

    $text_sm_footer_checkbox: boolean = false;
    onText_sm_footer_checkbox() {
        this.$text_sm_footer_checkbox = !this.$text_sm_footer_checkbox;
        if (this.$text_sm_footer_checkbox) {
            $('.main-footer').addClass('text-sm')
            localStorage.setItem('text_sm_footer_checkbox', "true")
        } else {
            $('.main-footer').removeClass('text-sm')
            localStorage.setItem('text_sm_footer_checkbox', "false")
        }
    }

    $flat_sidebar_checkbox: boolean = false;
    onFlat_sidebar_checkbox() {
        this.$flat_sidebar_checkbox = !this.$flat_sidebar_checkbox;
        if (this.$flat_sidebar_checkbox) {
            $('.nav-sidebar').addClass('nav-flat')
            localStorage.setItem('flat_sidebar_checkbox', "true")
        } else {
            $('.nav-sidebar').removeClass('nav-flat')
            localStorage.setItem('flat_sidebar_checkbox', "false")
        }
    }

    $legacy_sidebar_checkbox: boolean = false;
    onLegacy_sidebar_checkbox() {
        this.$legacy_sidebar_checkbox = !this.$legacy_sidebar_checkbox;
        if (this.$legacy_sidebar_checkbox) {
            $('.nav-sidebar').addClass('nav-legacy')
            localStorage.setItem('legacy_sidebar_checkbox', "true")
        } else {
            $('.nav-sidebar').removeClass('nav-legacy')
            localStorage.setItem('legacy_sidebar_checkbox', "false")
        }
    }

    $compact_sidebar_checkbox: boolean = false;
    onCompact_sidebar_checkbox() {
        this.$compact_sidebar_checkbox = !this.$compact_sidebar_checkbox;
        if (this.$compact_sidebar_checkbox) {
            $('.nav-sidebar').addClass('nav-compact')
            localStorage.setItem('compact_sidebar_checkbox', "true")
        } else {
            $('.nav-sidebar').removeClass('nav-compact')
            localStorage.setItem('compact_sidebar_checkbox', "false")
        }
    }

    $child_indent_sidebar_checkbox: boolean = false;
    onChild_indent_sidebar_checkbox() {
        this.$child_indent_sidebar_checkbox = !this.$child_indent_sidebar_checkbox;
        if (this.$child_indent_sidebar_checkbox) {
            $('.nav-sidebar').addClass('nav-child-indent')
            localStorage.setItem('child_indent_sidebar_checkbox', "true")
        } else {
            $('.nav-sidebar').removeClass('nav-child-indent')
            localStorage.setItem('child_indent_sidebar_checkbox', "false")
        }
    }

    $no_expand_sidebar_checkbox: boolean = false;
    onNo_expand_sidebar_checkbox() {
        this.$no_expand_sidebar_checkbox = !this.$no_expand_sidebar_checkbox;
        if (this.$no_expand_sidebar_checkbox) {
            $('.main-sidebar').addClass('sidebar-no-expand')
            localStorage.setItem('no_expand_sidebar_checkbox', "true")
        } else {
            $('.main-sidebar').removeClass('sidebar-no-expand')
            localStorage.setItem('no_expand_sidebar_checkbox', "false")
        }
    }

    onChangeNavbarColor(color) {
        color = "navbar-" + color;
        var $main_header = $('.main-header')
        $main_header.removeClass('navbar-dark').removeClass('navbar-light')

        this.navbar_all_colors.map(function (color) {
            $main_header.removeClass(color)
        })

        if (this.navbar_dark_skins.indexOf(color) > -1) {
            $main_header.addClass('navbar-dark')
        } else {
            $main_header.addClass('navbar-light')
        }

        $main_header.addClass(color)

        localStorage.setItem('navbar_variants_colors', color)
    }

    onChangeAccentColor(color) {
        var accent_class = "accent-" + color
        var $body = $('body')
        this.accent_colors.map(function (accent_class) {
            $body.removeClass(accent_class)
        })

        $body.addClass(accent_class)
        localStorage.setItem('accent_variants_color', accent_class)
    }

    onChangeDarkSidebar(color) {
        var sidebar_class = 'sidebar-dark-' + color.replace('bg-', '')
        var $sidebar = $('.main-sidebar')

        this.sidebar_skins.map(function (sidebar_class) {
            $sidebar.removeClass(sidebar_class)
        })

        $sidebar.addClass(sidebar_class)
        localStorage.setItem('sidebar_variants_color', sidebar_class)
    }

    onChangeLightSidebar(color) {
        var sidebar_class = 'sidebar-light-' + color.replace('bg-', '')
        var $sidebar = $('.main-sidebar')

        this.sidebar_skins.map(function (sidebar_class) {
            $sidebar.removeClass(sidebar_class)
        })

        $sidebar.addClass(sidebar_class)
        localStorage.setItem('sidebar_variants_color', sidebar_class)
    }

    onPushMenu(event) {
        event.preventDefault();
        if (Boolean(sessionStorage.getItem("sidebar-toggle-collapsed"))) {
            sessionStorage.setItem("sidebar-toggle-collapsed", "");
        } else {
            sessionStorage.setItem("sidebar-toggle-collapsed", "1");
        }
    }
}
