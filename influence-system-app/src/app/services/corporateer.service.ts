import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AppSettings } from '../app-settings';
import { Corporateer } from '../corporateer';
import { User } from '../user';
import { Rank } from '../rank';
import { Division } from '../division';
import { Influence } from '../influence';
import { AuthService } from './auth.service';

@Injectable()
export class CorporateerService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  constructor(private http: Http, private authService: AuthService) { }

  getCurrentCorporateer(): Promise<Corporateer> {
    const url = AppSettings.API + 'currentCorporateer/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Corporateer)
      .catch(this.handleError);
  }

  getCurrentInfluence(): Promise<Influence[]> {
    const url = AppSettings.API + 'currentInfluence/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Influence[])
      .catch(this.handleError);
  }

  setCurrentCoporateerMainDivision(division: string) {
    const url = AppSettings.API + 'setMyMainDivision/';
    return this.http.post(url, JSON.stringify({ division: division }), { headers: this.headers })
      .toPromise()
      .then(response => {
        return response
      })
      .catch(this.handleError);
  }

  distributeTributes() {
    const url = AppSettings.API + 'distributeTributes/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => {
        if (response.status === 200) {
          return true;
        }
        else {
          return false;
        }
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
