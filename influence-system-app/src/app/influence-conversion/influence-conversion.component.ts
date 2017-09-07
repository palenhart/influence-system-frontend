import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { Influence } from '../influence';
import { Corporateer } from '../corporateer';
import { map } from "rxjs/operator/map";

@Component({
  selector: 'app-influence-conversion',
  templateUrl: './influence-conversion.component.html',
  styleUrls: ['./influence-conversion.component.css']
})
export class InfluenceConversionComponent implements OnInit {

  model: any = {};
  error = '';

  influences: Influence[];
  influence = new Influence("none", "none", 0);
  amount: number;

  divisionsWithInfluence: string[];
  currentCorporateer: Corporateer;
  division: string;

  divisionCtrl: FormControl;
  amountCtrl: FormControl;

  influenceGeneralizationForm: FormGroup;

  constructor(private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService, private snackBar: MdSnackBar) {
    this.divisionCtrl = new FormControl('', [
      Validators.required
    ]),
      this.amountCtrl = new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+$/),
        Validators.max(this.influence.amount),
        Validators.min(1)
      ]),
      this.influenceGeneralizationForm = new FormGroup({
        'divisionCtrl': this.divisionCtrl,
        'amountCtrl': this.amountCtrl
      });
  }

  ngOnInit() {
    this.corporateerService.getCurrentInfluence().then(influences => {
      this.influences = influences.filter(influence => influence.department != "none").filter(influence => influence.amount != 0)
    });
  }

  private updateInfluenceAmount() {
    this.amountCtrl.setValidators([
      Validators.pattern(/^[-]?[0-9]+$/),
      Validators.max(this.influence.amount),
      Validators.min(1),
      Validators.required]);
    this.amountCtrl.updateValueAndValidity();
    this.amountCtrl.reset();
  }

  convertInfluence() {
    var influenceToConvert = new Influence(this.influence.division, this.influence.department, this.amount);
    this.corporateerService.convertInfluence(influenceToConvert)
      .then(response => {
        this.openSnackBar("Influence successfully converted")
        this.corporateerService.getCurrentInfluence().then(influences => {
          this.influences = influences.filter(influence => influence.department != "none").filter(influence => influence.amount != 0)
        });
      })
      .catch(error => {
        var reason = JSON.parse(error._body).reason;
        this.openSnackBar(reason);
      });
    this.influenceGeneralizationForm.reset();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}