import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Transaction } from '../transaction';
import { AuthService } from './auth.service';

@Injectable()
export class TransactionHistoryService {

  private apiUrl = 'http://localhost:8080/';

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  constructor(private http: Http, private authService: AuthService) { }

  getSendTransactions(): Promise<Transaction[]> {
    const url = this.apiUrl + 'getTransactions/sender';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Transaction[])
      .catch(this.handleError);
  }

  getReceivedTransactions(): Promise<Transaction[]> {
    const url = this.apiUrl + 'getTransactions/receiver';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Transaction[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
