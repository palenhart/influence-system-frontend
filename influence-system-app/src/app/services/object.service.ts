import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AppSettings } from '../app-settings';
import { Division } from '../division';
import { Corporateer } from '../corporateer';
import { User } from '../user';
import { AuthService } from './auth.service';

@Injectable()
export class ObjectService {
  
    private headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    });

  constructor(private http: Http, private authService: AuthService) { }

  getDivisions(): Promise<Division[]> {
    const url = AppSettings.API + 'divisions/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Division[])
      .catch(this.handleError);
  }

  getCorporateers(): Promise<Corporateer[]> {
    const url = AppSettings.API + 'corporateers/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Corporateer[])
      .catch(this.handleError);
  }

  getUsers(): Promise<User[]> {
    const url = AppSettings.API + 'users/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
