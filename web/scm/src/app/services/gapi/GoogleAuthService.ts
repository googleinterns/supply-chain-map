import { Injectable } from '@angular/core';
import { GoogleApiService } from './GoogleApiService';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;
import { Observable, Observer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GoogleAuthService {

    constructor(private googleApi: GoogleApiService, private router: Router) {
        this.googleApi.onLoad().subscribe(() => {
            this.loadGapiAuth().subscribe();
        });
    }

    private static readonly OAUTH_TOKEN_STORAGE_KEY = 'scmOauthToken';
    private static readonly OAUTH_EXPIRY_STORAGE_KEY = 'scmOauthExpiry';
    private googleAuth: GoogleAuth = undefined;
    private googleUser: GoogleUser = undefined;

    private loadGapiAuth(): Observable<GoogleAuth> {
        return new Observable((observer: Observer<GoogleAuth>) => {
            gapi.load('auth2', () => {
                gapi.auth2.init(this.googleApi.getConfig().getClientConfig()).then((auth: GoogleAuth) => {
                    this.googleAuth = auth;
                    observer.next(auth);
                    observer.complete();
                }).catch((err: any) => observer.error(err));
            });
        });
    }

    private getAuth(newInstance = false): Observable<GoogleAuth> {
        if (!this.googleAuth || newInstance) {
            return this.googleApi.onLoad()
                .pipe(mergeMap(() => this.loadGapiAuth()));
        }
        return of(this.googleAuth);
    }

    public isSignedIn(): boolean {
        if (this.getOauthToken()) {
            return true;
        }
        return false;
    }

    public signIn(): Promise<boolean> {
        return this.getAuth()
        .toPromise()
        .then(auth => auth.signIn())
        .then(gUser => {
            this.googleUser = gUser;
            const authResponse = this.googleUser.getAuthResponse();
            sessionStorage.setItem(
                GoogleAuthService.OAUTH_TOKEN_STORAGE_KEY, authResponse.access_token
            );
            sessionStorage.setItem(
                GoogleAuthService.OAUTH_EXPIRY_STORAGE_KEY, authResponse.expires_at.toString()
            );
            return true;
        })
        .catch(err => {
            return false;
        });
    }

    public getOauthToken(): string | void {
        const token = sessionStorage.getItem(GoogleAuthService.OAUTH_TOKEN_STORAGE_KEY);
        const expiry = parseInt(sessionStorage.getItem(GoogleAuthService.OAUTH_EXPIRY_STORAGE_KEY), 10);
        if (!token || !expiry || expiry <= Date.now()) {
            return;
        }
        return token;
    }
}
