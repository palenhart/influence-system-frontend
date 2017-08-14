import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Corporateer } from '../corporateer';
import { CorporateerService } from '../services/corporateer.service';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/';

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authService.getToken()
  });

  receiverCtrl: FormControl;
  amountCtrl: FormControl;
  typeCtrl: FormControl;
  messageCtrl: FormControl;

  filteredMembers: any;

  corporateers: Corporateer[];
  currentCorporateer = new Corporateer;
  amount;
  receiver= "";
  message = "";
  type = "influence";

  types = [
    { value: 'influence', viewValue: 'Influence' },
    { value: 'demerit', viewValue: 'Demerit' }
  ];

  transactionForm: FormGroup;

  constructor(private http: Http, private authService: AuthService, private corporateerService: CorporateerService) {

    this.receiverCtrl = new FormControl('', [
      Validators.required
    ]);
    this.amountCtrl = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[-]?[0-9]+$/),
      Validators.max(this.currentCorporateer.tributes),
      Validators.min(1)]);
    this.typeCtrl = new FormControl('', [
      Validators.required
    ]);
    this.messageCtrl = new FormControl('', [
      Validators.required,
      Validators.maxLength(250)
    ])

    this.transactionForm = new FormGroup({
      'receiverCtrl': this.receiverCtrl,
      'amountCtrl': this.amountCtrl,
      'typeCtrl': this.typeCtrl,
      'messageCtrl': this.messageCtrl
    });


    this.filteredMembers = this.receiverCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterMembers(name));
  }

  sendTransaction() {

    if (this.amount > this.currentCorporateer.tributes) {
      this.amountCtrl.setErrors({
        "max": true
      });
      return false;
    }

    if (this.corporateers.filter(corporateer => corporateer.name !== this.currentCorporateer.name).filter(corporateer => corporateer.name === this.receiver).length === 0) {
      this.receiverCtrl.setErrors({
        "invalid": true
      });
      return false;
    }

    const url = this.apiUrl + 'transfer/';
    return this.http.post(url,
      JSON.stringify({ receiver: this.receiver, message: this.message, amount: this.amount, type: this.type }), { headers: this.headers })
      .map((response: Response) => {
        if (response.status === 200) {
          this.corporateerService.getCurrentCorporateer().then(corporateer => this.currentCorporateer = corporateer);
          return true;
        } else {
          return false;
        }
      }).catch((error: any) => Observable.throw(error.json().error || 'Server error')).subscribe();
  }

  filterMembers(val: string) {
    if (val && val.length > 1) {
      return val ? this.corporateers.filter(corporateer => corporateer.name !== this.currentCorporateer.name)
        .filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) >= 0)
        : this.corporateers;
    }
  }

  ngOnInit() {
    this.corporateerService.getCorporateers().then(corporateers => this.corporateers = corporateers);
    this.corporateerService.getCurrentCorporateer().then(corporateer => this.currentCorporateer = corporateer);
  }

}
