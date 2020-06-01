import { Injectable } from '@angular/core';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;
import { Observable, Observer, of } from 'rxjs';
import { GoogleApiConfig } from './GoogleApiConfig';
import { environment } from 'src/environments/environment';

/**
 * Singleton class that holds basic user information
 */
export interface ScmBasicProfile {
    name: string;
    email: string;
    imageUrl: string;
}

/**
 * This service is used to authenticate users using Google OAuth2.0
 * Authentication is required to access Google APIs.
 */
@Injectable({
    providedIn: 'root'
})
export class GoogleAuthService {

    /**
     * Properties that hold the key to data stored in local storage
     */
    private static readonly OAUTH_TOKEN_STORAGE_KEY = 'scmOauthToken';
    private static readonly OAUTH_EXPIRY_STORAGE_KEY = 'scmOauthExpiry';
    private static readonly PROFILE_NAME_STORAGE_KEY = 'scmProfileName';
    private static readonly PROFILE_EMAIL_STORAGE_KEY = 'scmProfileEmail';
    private static readonly PROFILE_IMAGE_URL_STORAGE_KEY = 'scmProfileImageUrl';
    /** This is the GoogleAuth object that contains methods to sign-in and
     * get specific data from the user's Google profile.
     */
    private googleAuth: GoogleAuth = undefined;
    /** Holds the currently logged in user. */
    private googleUser: GoogleUser = undefined;
    /** This is the config that is sent along with the sign-in API.
     * This identifies SCM as the requestor, specifies the scopes
     * required by the application and the discovery documents of
     * the APIs that will be used.
     */
    private googleApiConfig = new GoogleApiConfig({
        client_id: environment.clientId,
        discoveryDocs: [environment.bigQuery.discoveryDocument],
        scope: [
            environment.bigQuery.scope
        ].join(' ')
    });

    constructor() {
        this.loadGapiAuth().subscribe();
    }

    /**
     * This is the method used to get the GoogleAuth object. We use
     * that object to sign-in the user and get profile information.
     */
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

    /**
     * Accessor to the private GoogleAuth property
     * @param newInstance boolean to indicate if a new instance of GoogleAuth is required.
     */
    private getAuth(newInstance = false): Observable<GoogleAuth> {
        if (!this.googleAuth || newInstance) {
            return this.loadGapiAuth();
        }
        return of(this.googleAuth);
    }

    /**
     * Identifies if a user is logged in. Since we only require the
     * OAuth token, the method checks if a vaild token is present to
     * decide if the user is loggen in.
     */
    public isSignedIn(): boolean {
        if (this.getOauthToken()) {
            return true;
        }
        return false;
    }

    /**
     * The method uses the GoogleAuth object to sign-in the user.
     * Once signed in, the OAuth token and other basic information
     * is stored in local storage.
     */
    public signIn(): Promise<boolean> {
        return this.getAuth()
        .toPromise()
        .then(auth => auth.signIn())
        .then(gUser => {
            this.googleUser = gUser;

            const authResponse = this.googleUser.getAuthResponse();
            localStorage.setItem(
                GoogleAuthService.OAUTH_TOKEN_STORAGE_KEY, authResponse.access_token
            );
            localStorage.setItem(
                GoogleAuthService.OAUTH_EXPIRY_STORAGE_KEY, authResponse.expires_at.toString()
            );

            const basicProfile = this.googleUser.getBasicProfile();
            localStorage.setItem(
                GoogleAuthService.PROFILE_NAME_STORAGE_KEY, basicProfile.getName()
            );
            localStorage.setItem(
                GoogleAuthService.PROFILE_EMAIL_STORAGE_KEY, basicProfile.getEmail()
            );
            localStorage.setItem(
                GoogleAuthService.PROFILE_IMAGE_URL_STORAGE_KEY, basicProfile.getImageUrl()
            );
            return true;
        })
        .catch(() => {
            return false;
        });
    }

    /**
     * Sign out user using the method provided by GoogleAuth.
     * Once signed out, clear local storage.
     */
    public signOut() {
        this.googleAuth
        .signOut()
        .then(() => {
            localStorage.clear();
            window.location.reload();
        });
    }

    /**
     * Retrieves token from local storage and check the validity.
     * If no token found, or if the token is stale, return nothing.
     */
    public getOauthToken(): string | void {
        const token = localStorage.getItem(GoogleAuthService.OAUTH_TOKEN_STORAGE_KEY);
        const expiry = parseInt(localStorage.getItem(GoogleAuthService.OAUTH_EXPIRY_STORAGE_KEY), 10);
        if (!token || !expiry || expiry <= Date.now()) {
            return;
        }
        return token;
    }

    /**
     * Returns an ScmBasicProfile object containing basic data about the logged in user
     */
    public getProfileData(): ScmBasicProfile {
        return {
            name: localStorage.getItem(GoogleAuthService.PROFILE_NAME_STORAGE_KEY),
            email: localStorage.getItem(GoogleAuthService.PROFILE_EMAIL_STORAGE_KEY),
            imageUrl: localStorage.getItem(GoogleAuthService.PROFILE_IMAGE_URL_STORAGE_KEY)
        };
    }
}
