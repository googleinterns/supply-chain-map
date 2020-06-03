import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authenticationService: GoogleAuthService
    ) { }

    async canActivate() {
        if (await this.authenticationService.isSignedIn()) {
            return true;
        } else {
            this.authenticationService.signIn();
            return false;
        }
    }
}
