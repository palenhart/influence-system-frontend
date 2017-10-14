import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {

    model: any = {};
    loading = false;
    error = '';

    usernameCtrl: FormControl;
    passwordCtrl: FormControl;

    loginForm: FormGroup;

    constructor(private authService: AuthService,
        private router: Router, private snackBar: MdSnackBar) {
        this.usernameCtrl = new FormControl('', [
            Validators.required
        ]),
            this.passwordCtrl = new FormControl('', [
                Validators.required]),

            this.loginForm = new FormGroup({
                'usernameCtrl': this.usernameCtrl,
                'passwordCtrl': this.passwordCtrl
            });
    }

    ngOnInit(): void {
    }

    login() {
        this.loading = true;
        this.authService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    // login successful
                    this.router.navigate(['profile']);
                } else {
                    // login failed
                    this.loading = false;
                }
            }, error => {
                this.loading = false;
                this.openSnackBar('Username or password is incorrect');
                this.error = error;
            });
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, 'Close', { duration: 3000 });
      }
}