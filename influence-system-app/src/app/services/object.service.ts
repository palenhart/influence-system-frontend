import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Division } from '../division';
import { AuthService } from './auth.service';

@Injectable()
export class ObjectService {

  private apiUrl = 'http://localhost:8080/';
  
    private headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken()
    });

  constructor(private http: Http, private authService: AuthService) { }

  getDivisions(): Promise<Division[]> {
    const url = this.apiUrl + 'getDivisions/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Division[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
