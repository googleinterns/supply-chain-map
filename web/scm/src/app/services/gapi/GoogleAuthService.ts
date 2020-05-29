import { Injectable } from '@angular/core';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;
import { Observable, Observer, of } from 'rxjs';
import { GoogleApiConfig } from './GoogleApiConfig';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleAuthService {

    constructor() {
        this.loadGapiAuth().subscribe();
    }

    private static readonly OAUTH_TOKEN_STORAGE_KEY = 'scmOauthToken';
    private static readonly OAUTH_EXPIRY_STORAGE_KEY = 'scmOauthExpiry';
    private static readonly PROFILE_NAME_STORAGE_KEY = 'scmProfileName';
    private static readonly PROFILE_EMAIL_STORAGE_KEY = 'scmProfileEmail';
    private static readonly PROFILE_IMAGE_URL_STORAGE_KEY = 'scmProfileImageUrl';
    private googleAuth: GoogleAuth = undefined;
    private googleUser: GoogleUser = undefined;
    private googleApiConfig = new GoogleApiConfig({
        client_id: environment.clientId,
        discoveryDocs: [environment.bigQuery.discoveryDocument],
        scope: [
            environment.bigQuery.scope
        ].join(' ')
    });

    private loadGapiAuth(): Observable<GoogleAuth> {
        return new Observable((observer: Observer<GoogleAuth>) => {
            gapi.load('auth2', () => {
                gapi.auth2.init(this.googleApiConfig.getClientConfig()).then((auth: GoogleAuth) => {
                    this.googleAuth = auth;
                    observer.next(auth);
                    observer.complete();
                }).catch((err: any) => observer.error(err));
            });
        });
    }

    private getAuth(newInstance = false): Observable<GoogleAuth> {
        if (!this.googleAuth || newInstance) {
            return this.loadGapiAuth();
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

            const basicProfile = this.googleUser.getBasicProfile();
            sessionStorage.setItem(
                GoogleAuthService.PROFILE_NAME_STORAGE_KEY, basicProfile.getName()
            );
            sessionStorage.setItem(
                GoogleAuthService.PROFILE_EMAIL_STORAGE_KEY, basicProfile.getEmail()
            );
            sessionStorage.setItem(
                GoogleAuthService.PROFILE_IMAGE_URL_STORAGE_KEY, basicProfile.getImageUrl()
            );
            return true;
        })
        .catch(() => {
            return false;
        });
    }

    /**
     * signOut
     */
    public signOut() {
        this.googleAuth
        .signOut()
        .then(() => {
            sessionStorage.clear();
            window.location.reload();
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

    /**
     * getProfileData returns an object containing basic data about the logged in user
     */
    public getProfileData(): ScmBasicProfile {
        return {
            name: sessionStorage.getItem(GoogleAuthService.PROFILE_NAME_STORAGE_KEY),
            email: sessionStorage.getItem(GoogleAuthService.PROFILE_EMAIL_STORAGE_KEY),
            imageUrl: sessionStorage.getItem(GoogleAuthService.PROFILE_IMAGE_URL_STORAGE_KEY)
        };
    }
}

export interface ScmBasicProfile {
    name: string;
    email: string;
    imageUrl: string;
}
