import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
    constructor(
        private authenticationService: GoogleAuthService,
        private router: Router
    ) { }

    async canActivate() {
        if (await this.authenticationService.isSignedIn()) {
            this.router.navigate(['']);
            return false;
        } else {
            return true;
        }
    }
}
