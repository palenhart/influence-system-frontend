import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { MdDialog } from '@angular/material';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../services/auth.service';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { Influence } from '../influence';
import { Corporateer } from '../corporateer';

@Component({
  selector: 'app-influence-conversion',
  templateUrl: './influence-conversion.component.html',
  styleUrls: ['./influence-conversion.component.css']
})
export class InfluenceConversionComponent implements OnInit {

  model: any = {};
  error = '';
  waiting = false;

  influences: Influence[];
  influence = new Influence("none", "none", 0);
  amount: number;
  toGeneral = false;

  divisionsWithInfluence: string[];
  currentCorporateer: Corporateer;
  division: string;

  divisionCtrl: FormControl;
  toGeneralCtrl: FormControl;
  amountCtrl: FormControl;

  influenceGeneralizationForm: FormGroup;

  constructor(public dialog: MdDialog, private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService, private snackBar: MdSnackBar) {
    this.divisionCtrl = new FormControl('', [
      Validators.required
    ]),
      this.toGeneralCtrl = new FormControl('', [
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
        'toGeneralCtrl': this.toGeneralCtrl,
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

    this.toGeneralCtrl.setValue(this.toGeneral);
    this.toGeneralCtrl.updateValueAndValidity();
  }

  confirmConvertInfluence(): void {
    var confirmationMessage;
    if (this.toGeneral || this.influence.division == 'none') {
      confirmationMessage = "Do you want to convert " + this.amount + " influence from " + this.influence.department + "||" + this.influence.division + " to general influence?";
    }
    else {
      confirmationMessage = "Do you want to convert " + this.amount + " influence from " + this.influence.department + "||" + this.influence.division + " to department influence?";
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { confirmationMessage: confirmationMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.convertInfluence();
      }
    });
  }

  convertInfluence() {
    this.waiting = true;
    var influenceToConvert = new Influence(this.influence.division, this.influence.department, this.amount);
    this.corporateerService.convertInfluence(influenceToConvert, this.toGeneral)
      .then(response => {
        this.openSnackBar("Influence successfully converted")
        this.corporateerService.getCurrentInfluence().then(influences => {
          this.influences = influences.filter(influence => influence.department != "none").filter(influence => influence.amount != 0);
          this.influence = new Influence("none", "none", 0);
          this.toGeneral = false;
          this.waiting = false;
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