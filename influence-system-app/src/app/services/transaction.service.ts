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
export class TransactionService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  transfer(receiver, message, amount, type) {
    const url = AppSettings.API + 'transfer/';
    return this.http.post(url,
      JSON.stringify({ receiver: receiver, message: message, amount: amount, type: type }), { headers: this.headers })
      .toPromise()
  }

  constructor(private http: Http, private authService: AuthService) { }

}
