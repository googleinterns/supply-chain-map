import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authenticationService: GoogleAuthService,
        private router: Router
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isSignedIn = await this.authenticationService.isSignedIn();
        if (state.url === '/login') {
            if (isSignedIn) {
                this.router.navigate(['']);
                return false;
            }
            return true;
        } else {
            if (!isSignedIn) {
                this.router.navigate(['login']);
                return false;
            }
            return true;
        }
    }
}
