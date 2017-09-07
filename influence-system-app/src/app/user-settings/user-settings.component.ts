import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { User } from '../user';
import { Division } from '../division';
import { Corporateer } from '../corporateer';
import { map } from "rxjs/operator/map";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  model: any = {};
  error = '';

  divisions: Division[];
  currentCorporateer: Corporateer;
  division: string;

  divisionCtrl: FormControl;
  oldPasswordCtrl: FormControl;
  newPasswordCtrl: FormControl;

  divisionChangeForm: FormGroup;
  passwordChangeForm: FormGroup;

  constructor(private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService, private snackBar: MdSnackBar) {
    this.divisionCtrl = new FormControl('', [
      Validators.required
    ]),
      this.oldPasswordCtrl = new FormControl('', [
        Validators.required
      ]),
      this.newPasswordCtrl = new FormControl('', [
        Validators.required
      ]),
      this.divisionChangeForm = new FormGroup({
        'divisionCtrl': this.divisionCtrl
      }),
      this.passwordChangeForm = new FormGroup({
        'oldPasswordCtrl': this.oldPasswordCtrl,
        'newPasswordCtrl': this.newPasswordCtrl
      });
  }

  ngOnInit() {
    this.objectService.getDivisions().then(divisions => this.divisions = divisions.filter(division => division.name != "none" || division.department.name == "none"));
    this.corporateerService.getCurrentCorporateer().then(corporateer => this.division = corporateer.mainDivision.name);
  }

  changeDivision() {
    this.corporateerService.setCurrentCoporateerMainDivision(this.division)
  }

  changePassword() {
    this.authService.changePassword(this.model.oldPassword, this.model.newPassword)
      .toPromise()
      .then(response => {
        this.openSnackBar("Password successfully changed")
      })
      .catch(error => {
        var reason = JSON.parse(error._body).reason;
        this.openSnackBar("Could not change password");
        if (reason === "wrong password") {
          this.oldPasswordCtrl.setErrors({ "wrong password": true });
        }
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}
