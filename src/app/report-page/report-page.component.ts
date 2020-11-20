/*
Author: Henryson
Date: 2020-11-16
Description: component dùng để test report thôi không sử dụng.
*/

import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var Stimulsoft: any;

@Component({
    selector: 'app-report-page',
    templateUrl: './report-page.component.html',
    styleUrls: ['./report-page.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ReportPageComponent implements OnInit {
    options: any = new Stimulsoft.Viewer.StiViewerOptions();
    viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, 'StiViewer', false);

    constructor() {}

    /* 
    let dataFromServer = [ { id: 1, name: "Danh Hoàn" } ];
    dsTable.readJson({ "DataSet":  dataFromServer});
    report.regData("keyDataSource", null, dsTable);
    */

    ngOnInit(): void {
        var report = new Stimulsoft.Report.StiReport();
		report.loadFile("assets/reports/rptPhieuDatHangNCC.mrt");

		report.dictionary.databases.clear();

        var dsThongTin = new Stimulsoft.System.Data.DataSet();
        // set data từ file json
        //dsThongTin.readJsonFile("data/ThongTin.json");
        
        // set data từ json data
		dsThongTin.readJson({
            ThongTin: {
                TieuDe: 'ĐƠN ĐẶT HÀNG'
            }
        });
		report.regData("ThongTin", null, dsThongTin);

        var dsThongTinCongTy = new Stimulsoft.System.Data.DataSet();
        // set data từ file json
		//dsThongTinCongTy.readJsonFile("data/ThongTinCongTy.json");
		report.regData("ThongTinCongTy", null, dsThongTinCongTy);

        var dsPhieuDatHangNCC = new Stimulsoft.System.Data.DataSet();
        // set data từ file json
		//dsPhieuDatHangNCC.readJsonFile("data/PhieuDatHangNCC.json");
		report.regData("PhieuDatHangNCC", null, dsPhieuDatHangNCC);

		this.viewer.report = report;
		this.viewer.renderHtml("viewerContent");
    }
}
