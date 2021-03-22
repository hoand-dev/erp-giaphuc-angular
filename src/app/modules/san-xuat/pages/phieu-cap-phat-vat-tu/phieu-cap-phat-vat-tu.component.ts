import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-phieu-cap-phat-vat-tu',
    templateUrl: './phieu-cap-phat-vat-tu.component.html',
    styleUrls: ['./phieu-cap-phat-vat-tu.component.css']
})
export class PhieuCapPhatVatTuComponent implements OnInit {
    public users: any = [
        { id: 1, name: 'hoàn' },
        { id: 2, name: 'hoàn 2' }
    ];
    customers: any[];

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = false;
    public enableUpdate: boolean = false;
    public enableDelete: boolean = false;
    public enableExport: boolean = false;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    onThemMoi() {
        this.router.navigate(['/phieu-cap-phat-vat-tu/them-moi']);
    }

    rowNumber(rowIndex){
        //return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    onToolbarPreparing(e) {
        console.log(2);

        //var dataGrid = e.component;
        e.toolbarOptions.items.unshift(
            {
                // location: "before",
                // locateInMenu: 'auto',
                // template: function () {
                //     return `<input style="width:200px" type="date" class="form-control datetimepicker" data-plugin="datepicker" data-autoclose="true" ng-model="dtNgayTu" id="dtNgayTu" placeholder="Từ ngày" my-datetimepicker/>`;// $(`<input style="width:200px" type="text" class="form-control datetimepicker" data-plugin="datepicker" data-autoclose="true" ng-model="dtNgayTu" id="dtNgayTu" placeholder="Từ ngày" my-datetimepicker/>`);
                // }
            },
            {
                // location: "before",
                // locateInMenu: 'auto',
                // template: function () {
                //     return `<input style="width:200px" type="date" class="form-control datetimepicker" data-plugin="datepicker" data-autoclose="true" ng-model="dtNgayDen" id="dtNgayDen" placeholder="Đến ngày" my-datetimepicker/>`; //$(`<input style="width:200px" type="text" class="form-control datetimepicker" data-plugin="datepicker" data-autoclose="true" ng-model="dtNgayDen" id="dtNgayDen" placeholder="Đến ngày" my-datetimepicker/>`);
                // }
            },
            {
                // location: "before",
                // widget: "dxButton",
                // locateInMenu: 'auto',
                // options: {
                //     text: "Tải lại",
                //     title: "Tải lại",
                //     icon: "refresh",
                //     onClick: function () {
                //         console.log("reload data...");
                //     }
                // }
            },
            {
                // location: "before",
                // widget: "dxButton",
                // locateInMenu: 'auto',
                // options: {
                // 	text: "Thêm mới",
                // 	title: "Thêm mới",
                // 	icon: "add",
                // 	onClick: function () {
                //         console.log("add new data...");
                //         location.href = "/nau-keo/yeu-cau-cap-vat-tu/them-moi";
                // 	}
                // }
            }
        );
    }
}
