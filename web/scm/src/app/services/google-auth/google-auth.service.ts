import { Injectable } from '@angular/core';
import GoogleAuth = gapi.auth2.GoogleAuth;
import { Observable, Observer, of } from 'rxjs';
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

    /** This is the GoogleAuth object that contains methods to sign-in and
     * get specific data from the user's Google profile.
     */
    private googleAuth: GoogleAuth = undefined;

    constructor() {
        this.loadGapiAuth();
    }

    /**
     * This is the method used to get the GoogleAuth object. We use
     * that object to sign-in the user and get profile information.
     */
    private loadGapiAuth(): Observable<GoogleAuth> {
        return new Observable((observer: Observer<GoogleAuth>) => {
            gapi.load('client:auth2', async () => {
                await gapi.client.init({
                    clientId: environment.clientId,
                    scope: environment.bigQuery.scope
                });
                this.googleAuth = gapi.auth2.getAuthInstance();
                observer.next(this.googleAuth);
                observer.complete();
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
     * Identifies if a user is logged in. Verification is
     * taken care of by gapi library.
     */
    public isSignedIn(): Promise<boolean> {
        return this.getAuth()
            .toPromise()
            .then(
                auth => auth.isSignedIn.get(),
                () => false
            );
    }

    /**
     * The method uses the GoogleAuth object to sign-in the user.
     * Once signed in, the OAuth token and other basic information
     * is stored in local storage.
     */
    public signIn(): void {
        this.getAuth()
            .toPromise()
            .then(
                auth => auth.signIn()
            )
            .then(
                () => window.location.reload()
            );
    }

    /**
     * Sign out user using the method provided by GoogleAuth.
     * Once signed out, clear local storage.
     */
    public signOut(): void {
        this.googleAuth
            .signOut()
            .then(() => {
                window.location.reload();
            });
    }

    /**
     * Returns basic data about the logged in user. This is available
     * in the GoogleUser object of the current logged in user.
     */
    public getProfileData(): Promise<ScmBasicProfile> {
        return this.getAuth()
            .toPromise()
            .then(
                auth => {
                    const googleUser = auth.currentUser.get();
                    const profile = googleUser.getBasicProfile();
                    return {
                        name: profile.getGivenName(),
                        email: profile.getEmail(),
                        imageUrl: profile.getImageUrl()
                    };
                },
                () => undefined
            );
    }
}
