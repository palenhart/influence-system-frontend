import { Component, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {

  login: boolean;
  isAdmin: boolean;
  loginSubscription: Subscription;
  adminSubscription: Subscription;

  constructor(private authService: AuthService, public snackBar: MdSnackBar,
    private router: Router) {
    this.loginSubscription = this.authService.getUserLoggedIn().subscribe(login => this.login = login),
      this.adminSubscription = this.authService.getIsAdmin().subscribe(isAdmin => this.isAdmin = isAdmin)
  }

  logout() {
    this.authService.logout();
    this.openSnackBar();
    this.router.navigate(['welcome']);
  }

  openSnackBar() {
    this.snackBar.open('You have been logged out', 'Close', { duration: 3000 });
  }

  ngOnInit() {
    this.authService.possibleStatusChange();
  }
}