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

    simpleProducts = [
        "HD Video Player",
        "SuperHD Video Player",
        "SuperPlasma 50",
        "SuperLED 50",
        "SuperLED 42",
        "SuperLCD 55",
        "SuperLCD 42",
        "SuperPlasma 65",
        "SuperLCD 70",
        "Projector Plus",
        "Projector PlusHT",
        "ExcelRemote IR",
        "ExcelRemote Bluetooth",
        "ExcelRemote IP"
    ];

    products: any[] = [{
        Id: 1,
        Name: "HD Video Player",
        Price: 330,
        Current_Inventory: 225,
        Backorder: 0,
        Manufacturing: 10,
        Category: "Video Players",
        ImageSrc: "images/products/1.png"
    }, {
        Id: 2,
        Name: "SuperHD Video Player",
        Price: 400,
        Current_Inventory: 150,
        Backorder: 0,
        Manufacturing: 25,
        Category: "Video Players",
        ImageSrc: "images/products/2.png"
    }, {
        Id: 3,
        Name: "SuperPlasma 50",
        Price: 2400,
        Current_Inventory: 0,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Televisions",
        ImageSrc: "images/products/3.png"
    }, {
        Id: 4,
        Name: "SuperLED 50",
        Price: 1600,
        Current_Inventory: 77,
        Backorder: 0,
        Manufacturing: 55,
        Category: "Televisions",
        ImageSrc: "images/products/4.png"
    }, {
        Id: 5,
        Name: "SuperLED 42",
        Price: 1450,
        Current_Inventory: 445,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Televisions",
        ImageSrc: "images/products/5.png"
    }, {
        Id: 6,
        Name: "SuperLCD 55",
        Price: 1350,
        Current_Inventory: 345,
        Backorder: 0,
        Manufacturing: 5,
        Category: "Televisions",
        ImageSrc: "images/products/6.png"
    }, {
        Id: 7,
        Name: "SuperLCD 42",
        Price: 1200,
        Current_Inventory: 210,
        Backorder: 0,
        Manufacturing: 20,
        Category: "Televisions",
        ImageSrc: "images/products/7.png"
    }, {
        Id: 8,
        Name: "SuperPlasma 65",
        Price: 3500,
        Current_Inventory: 0,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Televisions",
        ImageSrc: "images/products/8.png"
    }, {
        Id: 9,
        Name: "SuperLCD 70",
        Price: 4000,
        Current_Inventory: 95,
        Backorder: 0,
        Manufacturing: 5,
        Category: "Televisions",
        ImageSrc: "images/products/9.png"
    }, {
        Id: 10,
        Name: "DesktopLED 21",
        Price: 175,
        Current_Inventory: null,
        Backorder: 425,
        Manufacturing: 75,
        Category: "Monitors",
        ImageSrc: "images/products/10.png"
    }, {
        Id: 12,
        Name: "DesktopLCD 21",
        Price: 170,
        Current_Inventory: 210,
        Backorder: 0,
        Manufacturing: 60,
        Category: "Monitors",
        ImageSrc: "images/products/12.png"
    }, {
        Id: 13,
        Name: "DesktopLCD 19",
        Price: 160,
        Current_Inventory: 150,
        Backorder: 0,
        Manufacturing: 210,
        Category: "Monitors",
        ImageSrc: "images/products/13.png"
    }, {
        Id: 14,
        Name: "Projector Plus",
        Price: 550,
        Current_Inventory: null,
        Backorder: 55,
        Manufacturing: 10,
        Category: "Projectors",
        ImageSrc: "images/products/14.png"
    }, {
        Id: 15,
        Name: "Projector PlusHD",
        Price: 750,
        Current_Inventory: 110,
        Backorder: 0,
        Manufacturing: 90,
        Category: "Projectors",
        ImageSrc: "images/products/15.png"
    }, {
        Id: 16,
        Name: "Projector PlusHT",
        Price: 1050,
        Current_Inventory: 0,
        Backorder: 75,
        Manufacturing: 57,
        Category: "Projectors",
        ImageSrc: "images/products/16.png"
    }, {
        Id: 17,
        Name: "ExcelRemote IR",
        Price: 150,
        Current_Inventory: 650,
        Backorder: 0,
        Manufacturing: 190,
        Category: "Automation",
        ImageSrc: "images/products/17.png"
    }, {
        Id: 18,
        Name: "ExcelRemote Bluetooth",
        Price: 180,
        Current_Inventory: 310,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Automation",
        ImageSrc: "images/products/18.png"
    }, {
        Id: 19,
        Name: "ExcelRemote IP",
        Price: 200,
        Current_Inventory: 0,
        Backorder: 325,
        Manufacturing: 225,
        Category: "Automation",
        ImageSrc: "images/products/19.png"
    }
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
