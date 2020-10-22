import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { User } from '../_models';
// import { environment } from 'src/environments/environment';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string, grant_type: string = 'password') { // hoand grant_type
        // return this.http.post<any>(`${environment.apiUrl}/auth-token`, { username, password, grant_type })
        //     .pipe(map(user => {
        //         console.log(`User token:`);
        //         console.log(user);
                
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         localStorage.setItem('currentUser', JSON.stringify(user));
        //         localStorage.setItem('userToken', JSON.stringify(user.access_token));
        //         this.currentUserSubject.next(user);
        //         return user;
        //     }));

        var data = "username=" + username + "&password=" + password + "&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
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
        location.reload(true);
    }

    register(user: User) {
        const body: User = {
            id: user.id,
            username: user.username,
            password: user.password,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        }
        var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post(environment.apiUrl + '/auth-register', body, { headers: reqHeader });
    }

    authentication(username, password) {
        var data = "username=" + username + "&password=" + password + "&grant_type=password";
        var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
        return this.http.post(environment.apiUrl + '/auth-token', data, { headers: reqHeader });
    }

    getCurrentUser() {
        return this.http.get(environment.apiUrl + '/auth-current');
    }
}