import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';
import { Store } from '@ngrx/store';
import { BigQueryService } from './home/services/big-query/big-query.service';
import { environment } from 'src/environments/environment';
import { invalidServiceAccount } from './home/store/actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authenticationService: GoogleAuthService,
        private router: Router,
        private bigQueryService: BigQueryService,
        private store: Store
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
            } else if (!(await this.bigQueryService.checkProjectMembership(environment.projectId))) {
                this.store.dispatch(invalidServiceAccount({
                    error: new Error('User does not have access to project ' + environment.projectId)
                }));
            }
            return true;
        }
    }
}
