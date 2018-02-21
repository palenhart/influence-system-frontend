import {NgModule} from "@angular/core";

import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";


import {AuthComponent} from "./auth.component";
import {LoginFormComponent} from "./login-form/login-form.component";
import {RegisterFormComponent} from "./register-form/register-form.component";

/**import {TabViewModule} from "primeng/components/tabview/tabview";
import {ButtonModule} from "primeng/components/button/button";*/

import {AuthService} from "../services/auth.service";
import {AuthGuard} from "../services/auth-guard.service";
/**import {GrowlModule} from "primeng/components/growl/growl";*/
import {HttpModule} from "@angular/http";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule
        /**TabViewModule,
        ButtonModule,
        GrowlModule*/
    ],
    providers: [AuthService, AuthGuard],
    declarations: [AuthComponent, RegisterFormComponent],
    exports: [AuthComponent]
})
export class AuthModule {
}