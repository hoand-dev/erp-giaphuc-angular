import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService } from '../_services';

import * as $ from 'jquery';
import { HttpClient, HttpParams } from '@angular/common/http';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { CommonService } from '@app/shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    
    private subscription: Subscription;
    
    apiUrl: string = 'https://5f60284590cf8d001655758b.mockapi.io/users';

    public hanghoas: any[] = [
        { select_id: '8', tag_id: ['8'] },
        { select_id: '8', tag_id: ['8'] },
    ];

    selectBoxData: any = {};

    constructor(private httpClient: HttpClient, private commonService: CommonService, private authenticationService: AuthenticationService) { 
        let apiUrl = this.apiUrl;

        function isNotEmpty(value: any): boolean {
            return value !== undefined && value !== null && value !== "";
        }

        this.subscription = this.authenticationService.currentChiNhanh/* .pipe(first()) */
        .subscribe(x => {
            console.log("home page: " + x.id);

            this.selectBoxData = new DataSource({
                store: new CustomStore({
                    key: "id",
                    load: (loadOptions) => {
                        let params: HttpParams = new HttpParams();
                        [
                            "skip",
                            "take",
                            "sort",
                            "filter",
                            "searchExpr",
                            "searchOperation",
                            "searchValue",
                            "group",
                        ].forEach(function (i) {
                            if (i in loadOptions && isNotEmpty(loadOptions[i]))
                                params = params.set(i, JSON.stringify(loadOptions[i]));
                        });

                        // return this.httpClient.get(apiUrl/* , { params: params } */)
                        //     .toPromise()
                        //     .then(result => {
                        //         // Here, you can perform operations unsupported by the server
                        //         return result;
                        //     });

                        return httpClient.get(apiUrl/* , { params: params } */)
                            .toPromise()
                            .then(result => {
                                // Here, you can perform operations unsupported by the server
                                return result;
                            });
                    },
                    byKey: function (key) {
                        return httpClient.get(apiUrl + '/' + key).toPromise().then(result => {
                            // Here, you can perform operations unsupported by the server
                            return result;
                        });
                    }
                })
            });
        })
    }

    ngOnInit() {
        
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.

        // xử lý trước khi thoát khỏi trang
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    // hàng hóa thay đổi
    onChanged(i, e) {

    }

    // thêm hàng hóa mới
    onAddHangHoa() {
        this.hanghoas.push({ }); // thêm vào 1 HangHoa
    }

    // xem giá trị arr hàng hóa
    onClick() {
        console.log(this.hanghoas);
        let currentUser;
        this.authenticationService.currentUser.subscribe(x => currentUser = x);
    }
}
