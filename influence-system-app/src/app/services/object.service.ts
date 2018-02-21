import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AppSettings } from '../app-settings';
import { Division } from '../division';
import { Corporateer } from '../corporateer';
import { User } from '../user';
import { Rank } from '../rank';
import { Log } from '../log';
import { Auction } from '../auction';
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
  }

  getCorporateers(): Promise<Corporateer[]> {
    const url = AppSettings.API + 'corporateers/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Corporateer[])
  }

  getUsers(): Promise<User[]> {
    const url = AppSettings.API + 'users/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as User[])
  }

  getRanks(): Promise<Rank[]> {
    const url = AppSettings.API + 'ranks/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Rank[])
  }

  getLogs(): Promise<Log[]> {
    const url = AppSettings.API + 'logs/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Log[])
  }

  getAuctions() : Promise<Auction[]> {
    const url = AppSettings.API + 'auctions/';
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Auction[])
  }

  placeBid(auction: Auction, amount:number){
    const url = AppSettings.API + 'auctions/';
    return this.http.post(url, JSON.stringify({ id: auction.id, amount: amount }), { headers: this.headers })
    .toPromise();
  }

}
