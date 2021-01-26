import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';

import { HttpClient } from '@angular/common/http';
import { CommonService } from '@app/shared/services/common.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    private subscription: Subscription;

    constructor(private httpClient: HttpClient, private commonService: CommonService, private authenticationService: AuthenticationService) {}

    ngOnInit() {}
}
