import { Component, OnInit, Inject } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { CorporateerService } from '../services/corporateer.service';
import { AuthService } from "../services/auth.service";

import { User } from '../user';
import { Corporateer } from '../corporateer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  username: string;

  constructor(private authService: AuthService,
    private corporateerService: CorporateerService, public dialog: MdDialog, private snackBar: MdSnackBar) { }

  ngOnInit() {
  }

  distributeTributes() {
    this.corporateerService.distributeTributes()
    .then(response => {
      this.openSnackBar("Tributes successfully distributed")
    })
    .catch(error => {
      var reason = JSON.parse(error._body).message;
      this.openSnackBar(reason);
    });
  }

  createUser() {
    this.corporateerService.createUser(this.username)
    .then(response => {
      this.openSnackBar("User successfully created")
    })
    .catch(error => {
      var reason = JSON.parse(error._body).message;
      this.openSnackBar(reason);
    });
  }

  openNewUserDialog(): void {
    let dialogRef = this.dialog.open(NewUserDialog, {
      width: '250px',
      data: { username: this.username }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.username = result;
      this.createUser();
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}

@Component({
  selector: 'newuser-dialog',
  templateUrl: 'newuser-dialog.html',
})
export class NewUserDialog {

  constructor(
    public dialogRef: MdDialogRef<NewUserDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
