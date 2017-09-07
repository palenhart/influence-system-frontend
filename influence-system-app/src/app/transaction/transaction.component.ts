import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { AppSettings } from '../app-settings';
import { Corporateer } from '../corporateer';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { TransactionService } from '../services/transaction.service'
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

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
  receiver = "";
  message = "";
  type = "influence";

  types = [
    { value: 'influence', viewValue: 'Influence' },
    { value: 'demerit', viewValue: 'Demerit' }
  ];

  transactionForm: FormGroup;

  constructor(private http: Http, private authService: AuthService, private corporateerService: CorporateerService, private objectService: ObjectService, private transactionService: TransactionService, private snackBar: MdSnackBar) {

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

    this.transactionService.transfer(this.receiver, this.message, this.amount, this.type)
      .then(response => {
        this.openSnackBar("Transaction successful");
        this.corporateerService.getCurrentCorporateer().then(corporateer => this.currentCorporateer = corporateer);
      });
  }

  filterMembers(val: string) {
    if (val && val.length > 1) {
      return val ? this.corporateers.filter(corporateer => corporateer.name !== this.currentCorporateer.name)
        .filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) >= 0)
        : this.corporateers;
    }
  }

  ngOnInit() {
    this.objectService.getCorporateers().then(corporateers => this.corporateers = corporateers);
    this.corporateerService.getCurrentCorporateer().then(corporateer => this.currentCorporateer = corporateer);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}
