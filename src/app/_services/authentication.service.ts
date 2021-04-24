import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { ChiNhanh } from '@app/shared/entities';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    private currentChiNhanhSubject: BehaviorSubject<ChiNhanh>;
    public currentChiNhanh: Observable<ChiNhanh>;

    private disableChiNhanhSubject: BehaviorSubject<boolean>;
    public disableChiNhanh: Observable<boolean>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        
        this.currentChiNhanhSubject = new BehaviorSubject<ChiNhanh>(JSON.parse(localStorage.getItem('currentChiNhanh')));
        this.currentChiNhanh = this.currentChiNhanhSubject.asObservable();
        
        this.disableChiNhanhSubject = new BehaviorSubject<boolean>(false);
        this.disableChiNhanh = this.disableChiNhanhSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentChiNhanhValue(): ChiNhanh {
        return this.currentChiNhanhSubject.value;
    }

    public get disableChiNhanhValue(): boolean {
        return this.disableChiNhanhSubject.value;
    }

    public setChiNhanhValue(chinhanh: ChiNhanh): void{
        localStorage.setItem('currentChiNhanh', JSON.stringify(chinhanh));
        this.currentChiNhanhSubject.next(chinhanh);
    }

    public setDisableChiNhanh(disable: boolean): void{
        this.disableChiNhanhSubject.next(disable);
    }

    login(ip: string, username: string, password: string, grant_type: string = 'password') { // hoand grant_type
        var data = "username=" + username + "&password=" + password + "&grant_type=" + grant_type;
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True', "Ipv4-Login" : ip });
        return this.http.post<any>(environment.apiUrl + '/auth-token', data, { headers: reqHeader })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    refreshAuthToken(){
        if (this.currentUserSubject.value) {
            let refresh_token: string = this.currentUserSubject.value.refresh_token, grant_type: string = 'refresh_token';
            var data = "refresh_token=" + refresh_token + "&grant_type=" + grant_type;
            var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
            return this.http.post<any>(environment.apiUrl + '/auth-token', data, { headers: reqHeader })
                .pipe(map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }));
        }
    }

    // register(user: User) {
    //     const body: User = {
    //         id: user.id,
    //         username: user.username,
    //         password: user.password,
    //         email: user.email,
    //         firstName: user.firstName,
    //         lastName: user.lastName
    //     }
    //     var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    //     return this.http.post(environment.apiUrl + '/auth-register', body, { headers: reqHeader });
    // }

    // authentication(username, password) {
    //     var data = "username=" + username + "&password=" + password + "&grant_type=password";
    //     var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    //     return this.http.post(environment.apiUrl + '/auth-token', data, { headers: reqHeader });
    // }
}