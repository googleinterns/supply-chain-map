import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authenticationService: GoogleAuthService,
        private router: Router
    ) { }

    async canActivate() {
        if (await this.authenticationService.isSignedIn()) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
