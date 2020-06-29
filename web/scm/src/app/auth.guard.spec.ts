import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { GoogleAuthService } from './services/google-auth/google-auth.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BigQueryService } from './home/services/big-query/big-query.service';

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

class MockBigQueryService {
    checkProjectMembership(projectId: string): boolean {
        return true;
    }
}

describe('AuthGuard', () => {
    describe('canActivate', () => {
        let authGuard: AuthGuard;
        let authService: GoogleAuthService;
        let router: Router;
        let state: RouterStateSnapshot;
        let store: MockStore;
        let bigQueryService: BigQueryService;
        let dispatchSpy: jasmine.Spy;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [AuthGuard,
                    provideMockStore(),
                    { provide: Router, useClass: MockRouter },
                    { provide: ActivatedRouteSnapshot, useClass: MockActivatedRouteSnapshot },
                    { provide: GoogleAuthService, useClass: MockAuthService },
                    { provide: RouterStateSnapshot, useClass: MockRouterStateSnapshot },
                    { provide: BigQueryService, useClass: MockBigQueryService }
                ]
            });
            router = TestBed.inject(Router);
            spyOn(router, 'navigate');
            authService = TestBed.inject(GoogleAuthService);
            authService.signIn();
            authGuard = TestBed.inject(AuthGuard);
            state = TestBed.inject(RouterStateSnapshot);
            store = TestBed.inject(MockStore);
            bigQueryService = TestBed.inject(BigQueryService);
            dispatchSpy = spyOn(store, 'dispatch');
        });

        it('should return false and redirect to (/login) initially (/)', async () => {
            // Initially at login screen
            state.url = '/';

            authService.signOut();
            expect(await authGuard.canActivate(null, state)).toBeFalse();
            expect(dispatchSpy).not.toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['login']);
        });

        it('should return false and redirect to (/) after sign in (/login)', async () => {
            // Initially at login screen
            state.url = '/login';

            authService.signIn();
            expect(await authGuard.canActivate(null, state)).toBeFalse();
            expect(dispatchSpy).not.toHaveBeenCalled();
            expect(router.navigate).toHaveBeenCalledWith(['']);
        });

    });
});
