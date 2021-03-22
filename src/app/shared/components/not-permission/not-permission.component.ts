import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteInterceptorService } from '@app/shared/services';

@Component({
    selector: 'app-not-permission',
    templateUrl: './not-permission.component.html',
    styleUrls: ['./not-permission.component.css']
})
export class NotPermissionComponent implements OnInit {
    public url: string;
    constructor(private routeInterceptorService: RouteInterceptorService) {}

    ngOnInit(): void {
        this.url = this.routeInterceptorService.previousUrl;
    }
}
