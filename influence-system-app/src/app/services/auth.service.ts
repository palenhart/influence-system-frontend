import { BootController } from '../../boot-control';
import { Injectable, NgZone } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AppSettings } from '../app-settings';
import { User } from '../user';
import { Role } from '../role';

@Injectable()
export class AuthService {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    private userLoggedIn = new Subject<boolean>();
    private userAdmin = new Subject<boolean>();

    private userIsAdmin: boolean;

    constructor(private http: Http, private ngZone: NgZone) {
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(AppSettings.API + 'auth', JSON.stringify({ username: username, password: password }), { headers: this.headers })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    // return true to indicate successful login
                    this.possibleStatusChange();
                    return true;
                } else {
                    // return false to indicate failed login
                    this.possibleStatusChange();
                    return false;
                }
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getToken(): String {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var token = currentUser && currentUser.token;
        return token ? token : "";
    }

    isLoggedIn(): boolean {
        var token: String = this.getToken();
        if (token && token.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    isAdminPromise(): Promise<boolean> {
        if (!this.isLoggedIn()) {
            return Promise.resolve(false);
        }
        return this.getCurrentUser().then(user => {
            if (user.roles.findIndex(role => role.name.indexOf("ROLE_ADMIN") >= 0) >= 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.ngZone.runOutsideAngular(() => BootController.getbootControl().restart());
        this.possibleStatusChange();
    }

    changePassword(currentPassword: string, newPassword: string): Observable<any> {
        const url = AppSettings.API + 'changePassword';
        var secureHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(url, JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword }), { headers: secureHeaders })
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    getCurrentUser(): Promise<User> {
        const url = AppSettings.API + 'currentUser';
        var secureHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.get(url, { headers: secureHeaders })
            .toPromise()
            .then(response => response.json() as User)
        /**.catch(this.handleError);*/
    }

    possibleStatusChange(): void {
        this.userLoggedIn.next(this.isLoggedIn());

        this.isAdminPromise().then(is => {
            this.userIsAdmin = is;
            this.userAdmin.next(is)
        })
    }

    getUserLoggedIn(): Observable<boolean> {
        return this.userLoggedIn.asObservable();
    }

    getIsAdmin(): Observable<boolean> {
        return this.userAdmin.asObservable();
    }

    isAdmin(): boolean {
        return this.userIsAdmin;
    }
}