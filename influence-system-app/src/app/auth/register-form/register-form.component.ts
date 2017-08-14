import {Component, OnInit} from '@angular/core';

/**import {Message} from "primeng/components/common/api";*/

import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: './register-form.component.html'
})
export class RegisterFormComponent implements OnInit {

    model: User;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.model = new User();
    }

    /**onSubmit(): void {
        this.authService
            .register(this.model)
            .subscribe(isRegistered => {
                if (isRegistered) this.messages.push({severity: 'info', summary: 'Registered successfully!'});
                else this.messages.push({severity: 'error', summary: 'Email already in use'});
    });
    }*/
}