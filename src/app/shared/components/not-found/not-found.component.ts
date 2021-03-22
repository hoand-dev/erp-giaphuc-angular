import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
    public url: string;
    constructor(public router: Router) {}

    ngOnInit(): void {
        this.url = this.router.url;
    }
}
