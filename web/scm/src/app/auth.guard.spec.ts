import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { GoogleAuthService } from './services/google-auth/google-auth.service';

class MockRouter {
    navigate(path) { }
}

class MockActivatedRouteSnapshot {
    private data: any;
}

class MockRouterStateSnapshot {
    url = '/';
}

class MockAuthService {

    private signedIn = false;

    signIn() {
        this.signedIn = true;
    }

    signOut() {
        this.signedIn = false;
    }

    isSignedIn() {
        return this.signedIn;
    }

}

describe('AuthGuard', () => {
    describe('canActivate', () => {
        let authGuard: AuthGuard;
        let authService: GoogleAuthService;
        let router: Router;
        let state: RouterStateSnapshot;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [AuthGuard,
                    { provide: Router, useClass: MockRouter },
                    { provide: ActivatedRouteSnapshot, useClass: MockActivatedRouteSnapshot },
                    { provide: GoogleAuthService, useClass: MockAuthService },
                    { provide: RouterStateSnapshot, useClass: MockRouterStateSnapshot }
                ]
            });
            router = TestBed.inject(Router);
            spyOn(router, 'navigate');
            authService = TestBed.inject(GoogleAuthService);
            authService.signIn();
            authGuard = TestBed.inject(AuthGuard);
            state = TestBed.inject(RouterStateSnapshot);
        });

        it('should return false and redirect to (/login) initially (/)', async () => {
            authService.signOut();
            expect(await authGuard.canActivate(null, state)).toBeFalse();
            expect(router.navigate).toHaveBeenCalledWith(['login']);
        });

        it('should return false and redirect to (/) after sign in (/login)', async () => {
            state.url = '/login';
            authService.signIn();
            expect(await authGuard.canActivate(null, state)).toBeFalse();
            expect(router.navigate).toHaveBeenCalledWith(['']);
        });

        it('should return true and not redirect when signed in (/)', async () => {
            authService.signIn();
            expect(await authGuard.canActivate(null, state)).toBeTrue();
            expect(router.navigate).not.toHaveBeenCalledWith(['']);
        });

    });
});
