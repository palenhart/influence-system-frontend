import { Component, OnInit, Inject } from '@angular/core';
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
    private corporateerService: CorporateerService, public dialog: MdDialog) { }

  ngOnInit() {
  }

  distributeTributes() {
    this.corporateerService.distributeTributes();
  }

  createUser() {
    this.corporateerService.createUser(this.username);
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
