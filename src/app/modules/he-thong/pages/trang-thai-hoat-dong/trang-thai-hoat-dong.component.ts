import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppInfoService, CommonService, Ipv4Service } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import DataSource from 'devextreme/data/data_source';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import moment from 'moment';
import 'moment/locale/vi';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Ipv4ModalComponent } from '../../modals/ipv4-modal/ipv4-modal.component';

@Component({
  selector: 'app-trang-thai-hoat-dong',
  templateUrl: './trang-thai-hoat-dong.component.html',
  styleUrls: ['./trang-thai-hoat-dong.component.css']
})
export class TrangThaiHoatDongComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

    /* tối ưu subscriptions */
    subscriptions: Subscription = new Subscription();
    public bsModalRef: BsModalRef;

    /* danh sách quyền được cấp */
    public permissions: any[] = [];

    /* danh sách các quyền theo biến số, mặc định false */
    public enableAddNew: boolean = true;
    public enableUpdate: boolean = true;
    public enableDelete: boolean = true;
    public enableExport: boolean = true;

    /* dataGrid */
    public exportFileName: string = '[DANH SÁCH] - TRẠNG THÁI HOẠT ĐỘNG - ' + moment().format('DD_MM_YYYY');

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_TrangThaiHoatDong'
    };

    constructor(
        private titleService: Title,
        private appInfoService: AppInfoService,
        private router: Router,
        private commonService: CommonService,
        private ipv4Service: Ipv4Service,
        private modalService: BsModalService
    ) {
        this.titleService.setTitle('TRẠNG THÁI HOẠT ĐỘNG | ' + this.appInfoService.appName);
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.commonService.timKiem_QuyenDuocCap().subscribe(
                (data) => {
                    this.permissions = data;
                    // if (!this.commonService.getEnablePermission(this.permissions, 'ipv4-truycap')) {
                    //     this.router.navigate(['/khong-co-quyen']);
                    // }
                    // this.enableAddNew = this.commonService.getEnablePermission(this.permissions, 'ipv4-themmoi');
                    // this.enableUpdate = this.commonService.getEnablePermission(this.permissions, 'ipv4-capnhat');
                    // this.enableDelete = this.commonService.getEnablePermission(this.permissions, 'ipv4-xoa');
                    // this.enableExport = this.commonService.getEnablePermission(this.permissions, 'ipv4-xuatdulieu');
                },
                (error) => {
                    this.ipv4Service.handleError(error);
                }
            )
        );
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        
        this.onLoadData();
        
        setInterval(()=>{
            this.onLoadData();
        }, 1000 * 30);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.ipv4Service.viewOnline().subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.ipv4Service.handleError(error);
                }
            )
        );
    }

    rowNumber(rowIndex) {
        return this.dataGrid.instance.pageIndex() * this.dataGrid.instance.pageSize() + rowIndex + 1;
    }

    customThoiGian(value){
        return moment(value.data.last_activity, "YYYY-MM-DD HH:mm:ss").fromNow();
    }
}
