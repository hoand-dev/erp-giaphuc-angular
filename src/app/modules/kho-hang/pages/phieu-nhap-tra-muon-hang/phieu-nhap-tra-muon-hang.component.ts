import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhieuNhapTraMuonHang } from '@app/shared/entities';
import { PhieuNhapTraMuonHangService } from '@app/shared/services';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { AuthenticationService } from '@app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PhieuNhapTraMuonHangInPhieuModalComponent } from '../../modals/phieu-nhap-tra-muon-hang-in-phieu-modal/phieu-nhap-tra-muon-hang-in-phieu-modal.component';

@Component({
    selector: 'app-phieu-nhap-tra-muon-hang',
    templateUrl: './phieu-nhap-tra-muon-hang.component.html',
    styleUrls: ['./phieu-nhap-tra-muon-hang.component.css']
})
export class PhieuNhapTraMuonHangComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
    public bsModalRef: BsModalRef;
    
    /* tối ưu subscriptions */
    private subscriptions: Subscription = new Subscription();

    /* khai báo thời gian bắt đầu và thời gian kết thúc */
    public firstDayTime: Date;
    public currDayTime: Date = new Date();

    public stateStoringGrid = {
        enabled: true,
        type: 'localStorage',
        storageKey: 'dxGrid_PhieuNhapTraMuonHang'
    };

    constructor(private router: Router, private objPhieuNhapTraMuonHangService: PhieuNhapTraMuonHangService, private authenticationService: AuthenticationService, private modalService: BsModalService) {}

    ngOnInit(): void {
        // khởi tạo thời gian bắt đầu và thời gian kết thúc
        this.firstDayTime = new Date(moment().get('year'), moment().get('month'), 1);
        this.currDayTime = moment().add(1, 'days').toDate();
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.subscriptions.add(
            this.authenticationService.currentChiNhanh /* .pipe(first()) */
                .subscribe((x) => {
                    this.onLoadData();
                })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        this.subscriptions.unsubscribe();
    }

    onLoadData() {
        this.subscriptions.add(
            this.objPhieuNhapTraMuonHangService.findPhieuNhapTraMuonHangs(this.authenticationService.currentChiNhanhValue.id, this.firstDayTime, this.currDayTime).subscribe(
                (data) => {
                    this.dataGrid.dataSource = data;
                },
                (error) => {
                    this.objPhieuNhapTraMuonHangService.handleError(error);
                }
            )
        );
    }

    addMenuItems(e) {
        if (e.row.rowType === 'data') {
            // e.items can be undefined
            if (!e.items) e.items = [];

            // bạn có thể thêm context theo trường mình muốn thông qua e.column

            // Add a custom menu item
            e.items.push(
                {
                    text: 'In phiếu',
                    icon: 'print',
                    visible: true,
                    onItemClick: () => {
                        let rowData: PhieuNhapTraMuonHang = e.row.key as PhieuNhapTraMuonHang;
                        /* khởi tạo giá trị cho modal */
                        const initialState = {
                            title: "XEM IN PHIẾU NHẬP TRẢ MƯỢN HÀNG",
                            phieunhaptramuonhang_id: rowData.id
                        };

                        /* hiển thị modal */
                        this.bsModalRef = this.modalService.show(PhieuNhapTraMuonHangInPhieuModalComponent, {
                            class: 'modal-xl modal-dialog-centered',
                            ignoreBackdropClick: false,
                            keyboard: false,
                            initialState
                        });
                        this.bsModalRef.content.closeBtnName = 'Đóng';
                    }
                }
            );
        }
    }
    
    onRowDblClick(e) {
        // chuyển sang view xem chi tiết
        console.log(`objPhieuNhapTraMuonHang_id: ${e.key.id}`);
    }

    onRowDelete(id) {
        let result = confirm('<i>Bạn có muốn xóa phiếu này?</i>', 'Xác nhận xóa');
        result.then((dialogResult) => {
            if (dialogResult) {
                // gọi service xóa
                this.subscriptions.add(
                    this.objPhieuNhapTraMuonHangService.deletePhieuNhapTraMuonHang(id).subscribe(
                        (data) => {
                            if (data) {
                                notify(
                                    {
                                        width: 320,
                                        message: 'Xóa thành công',
                                        position: { my: 'right top', at: 'right top' }
                                    },
                                    'success',
                                    475
                                );
                            }
                            // load lại dữ liệu
                            this.onLoadData();
                        },
                        (error) => {
                            this.objPhieuNhapTraMuonHangService.handleError(error);
                            // load lại dữ liệu
                            this.onLoadData();
                        }
                    )
                );
            }
        });
    }
}
