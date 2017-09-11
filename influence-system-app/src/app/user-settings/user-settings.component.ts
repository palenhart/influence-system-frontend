import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
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
  division: string;

  divisionCtrl: FormControl;
  currentPasswordCtrl: FormControl;
  newPasswordCtrl: FormControl;

  divisionChangeForm: FormGroup;
  passwordChangeForm: FormGroup;

  constructor(public dialog: MdDialog, private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService, private snackBar: MdSnackBar) {
    this.divisionCtrl = new FormControl('', [
      Validators.required
    ]),
      this.currentPasswordCtrl = new FormControl('', [
        Validators.required
      ]),
      this.newPasswordCtrl = new FormControl('', [
        Validators.required
      ]),
      this.divisionChangeForm = new FormGroup({
        'divisionCtrl': this.divisionCtrl
      }),
      this.passwordChangeForm = new FormGroup({
        'currentPasswordCtrl': this.currentPasswordCtrl,
        'newPasswordCtrl': this.newPasswordCtrl
      });
  }

  ngOnInit() {
    this.objectService.getDivisions().then(divisions => this.divisions = divisions.filter(division => division.name != "none" || division.department.name == "none"));
    this.corporateerService.getCurrentCorporateer().then(corporateer => this.division = corporateer.mainDivision.name);
  }

  confirmChangeDivision(): void {
    var confirmationMessage;
    confirmationMessage = "Do you want to change your main division to " + this.division + "?";

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { confirmationMessage: confirmationMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.changeDivision();
      }
    });
  }

  changeDivision() {
    this.corporateerService.setCurrentCoporateerMainDivision(this.division)
  }

  confirmChangePassword(): void {
    var confirmPassword;
    let dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '250px',
      data: { confirmPassword: confirmPassword }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == this.model.newPassword) {
        this.changePassword();
      }
      else if (result.length > 0) {
        this.openSnackBar("Passwords didn't match")
      }
    });
  }

  changePassword() {
    this.authService.changePassword(this.model.currentPassword, this.model.newPassword)
      .toPromise()
      .then(response => {
        this.openSnackBar("Password successfully changed")
      })
      .catch(error => {
        var reason = JSON.parse(error._body).reason;
        this.openSnackBar(reason);
        if (reason === "wrong password") {
          this.currentPasswordCtrl.setErrors({ "wrong password": true });
        }
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}

@Component({
  selector: 'changepassword-dialog',
  templateUrl: 'changepassword-dialog.html',
})
export class ChangePasswordDialog {

  constructor(
    public dialogRef: MdDialogRef<ChangePasswordDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
