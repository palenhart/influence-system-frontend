import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { User } from '../user';
import { map } from "rxjs/operator/map";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  model: any = {};
  error = '';

  oldPasswordCtrl: FormControl;
  newPasswordCtrl: FormControl;

  passwordChangeForm: FormGroup;

  constructor(private authService: AuthService, private snackBar: MdSnackBar) {
    this.oldPasswordCtrl = new FormControl('', [
      Validators.required
    ]),
      this.newPasswordCtrl = new FormControl('', [
        Validators.required
      ]),
      this.passwordChangeForm = new FormGroup({
        'oldPasswordCtrl': this.oldPasswordCtrl,
        'newPasswordCtrl': this.newPasswordCtrl
      });
  }

  ngOnInit() {
  }

  changePassword() {
    this.authService.changePassword(this.model.oldPassword, this.model.newPassword)
      .toPromise()
      .then(response => {
        this.openSnackBar("Password successfully changed")
      })
      .catch(error => {
        this.openSnackBar(JSON.parse(error._body).reason)
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}
