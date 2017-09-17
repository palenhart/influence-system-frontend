import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.authService.isLoggedInPromise().then(is => {
            if (is) {
                return true;
            }
            else {
                this.authService.possibleStatusChange();
                this.router.navigate(['login']);
                return false;
            }
        });
    }
}