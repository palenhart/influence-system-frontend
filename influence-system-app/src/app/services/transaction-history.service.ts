import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AppSettings } from '../app-settings';
import { Transaction } from '../transaction';
import { AuthService } from './auth.service';

@Injectable()
export class TransactionHistoryService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  constructor(private http: Http, private authService: AuthService) { }

  getSendTransactions(): Promise<Transaction[]> {
    const url = AppSettings.API + 'transactions/sender';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Transaction[])
  }

  getReceivedTransactions(): Promise<Transaction[]> {
    const url = AppSettings.API + 'transactions/receiver';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Transaction[])
  }

  getAllTransactions(): Promise<Transaction[]> {
    const url = AppSettings.API + 'transactions';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Transaction[])
  }

}
