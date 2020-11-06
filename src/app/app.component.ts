import { Component, HostBinding, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import DataSource from 'devextreme/data/data_source';

import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';

import { ChiNhanh } from './shared/entities';
import { ChiNhanhService, NguoiDungService } from './shared/services';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    currentUserToken: User;
    currentUser: User = new User();

    chinhanhs: ChiNhanh[] = [];

    fisrtRefreshToken: boolean = true;

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
    private chinhanhSelected: ChiNhanh;

    constructor(
        public router: Router,
        private authenticationService: AuthenticationService,
        private chinhanhService: ChiNhanhService,
        private nguoidungService: NguoiDungService,
    ) {

    }

    ngOnInit(): void {
        this.subscriptions.add(this.authenticationService.currentUser.subscribe(x => this.currentUserToken = x));

        if (this.isAutorized()) {
            this.subscriptions.add(this.nguoidungService.getCurrentUser().subscribe(x =>
                this.currentUser = x
            ));
            this.subscriptions.add(this.chinhanhService.findChiNhanhs().subscribe(
                data => {
                    this.chinhanhs = data;
                    if (this.authenticationService.currentChiNhanhValue) {
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            if (element.id == this.authenticationService.currentChiNhanhValue.id) {
                                this.chinhanhSelected = element;
                            }
                        }
                    }
                    else this.chinhanhSelected = data[0];
                },
                error => {
                    this.chinhanhService.handleError(error);
                }
            ));
            
            if (this.fisrtRefreshToken){
                console.log("refresh token...");
                
                this.fisrtRefreshToken = false;
                this.refreshAuthToken();
            }

            setInterval(() => {
                console.log("interval refresh token...");

                this.refreshAuthToken();
            }, 1000 * 60 * 25);
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

    activeGroupClass(groupName: string = null){
        const DULIEUCOSO = [
            "/chi-nhanh", 
            "/danh-muc-gia-cong",
            "/danh-muc-loi",
            "/danh-muc-no",
            "/danh-muc-tieu-chuan",
            "/khu-vuc",
            "/don-vi-gia-cong",
            "/don-vi-tinh",
            "/noi-dung-thu-chi",
            "/quy-tai-khoan",
            "/so-mat",
            "/kho-hang",
            "/hang-hoa-nguyen-lieu",
            "/hang-hoa-hang-tron",
            "/danh-sach-xe",
            "/dinh-muc",
            "/nguon-nhan-luc"
        ];
        const SANXUAT = [
            "/phieu-cap-phat-vat-tu", 
        ];
        const MUAHANG = [
            "/phieu-mua-hang", 
        ];
        const BANHANG = [
            "/phieu-ban-hang", 
        ];
        const KHOHANG = [
            "/phieu-nhap-kho", 
        ];
        const KETOAN = [
            "/phieu-thu", 
        ];
        
        /* xử lý chuỗi url */
        function indexOf(string, sub, index) {
            if (index <= 1){
                return string.indexOf(sub);
            }
            return string.split(sub, index).join(sub).length;
        }

        let $return = false;
        let $url = this.router.url;
        let $indexSecond = indexOf($url, '/', 2);
        $url = $url.substring(0, $indexSecond);

        /* kiểm tra chuỗi đã xử lý */
        switch (groupName) {
            case 'DULIEUCOSO': $return = DULIEUCOSO.includes($url);  break;
            case 'SANXUAT': $return = SANXUAT.includes($url);  break;
            case 'MUAHANG': $return = MUAHANG.includes($url);  break;
            case 'BANHANG': $return = BANHANG.includes($url);  break;
            case 'KHOHANG': $return = KHOHANG.includes($url);  break;
            case 'KETOAN': $return = KETOAN.includes($url);  break;
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
