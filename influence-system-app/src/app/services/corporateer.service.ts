import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Corporateer } from '../corporateer';
import { User } from '../user';
import { Rank } from '../rank';
import { Division } from '../division';
import { AuthService } from './auth.service';

@Injectable()
export class CorporateerService {

  private apiUrl = 'http://localhost:8080/';

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  constructor(private http: Http, private authService: AuthService) { }

  getCorporateers(): Promise<Corporateer[]> {
    const url = this.apiUrl + 'corporateers/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json()._embedded.corporateers as Corporateer[])
      .catch(this.handleError);
  }

  /**getCorporateer(id: number): Promise<Corporateer> {
    const url = this.apiUrl + 'corporateers/' + id;
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Corporateer)
      .catch(this.handleError);
  }*/

  getCurrentCorporateer(): Promise<Corporateer> {
    const url = this.apiUrl + 'currentCorporateer/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Corporateer)
      .catch(this.handleError);
  }

  setCurrentCoporateerMainDivision(division: string) {
    const url = this.apiUrl + 'setMyMainDivision/';
    return this.http.post(url, JSON.stringify({ division: division }), { headers: this.headers })
      .toPromise()
      .then(response => {
        return response
      })
      .catch(this.handleError);
  }

  distributeTributes() {
    const url = this.apiUrl + 'distributeTributes/';
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
