import { Injectable } from '@angular/core';
import { GoogleApiConfig } from './GoogleApiConfig';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GoogleApiService {
    private readonly gapiUrl: string = 'https://apis.google.com/js/api.js';
    private config: GoogleApiConfig;

    constructor() {
        this.config = new GoogleApiConfig({
            client_id: environment.clientId,
            discoveryDocs: [environment.bigQueryDiscoveryDocument],
            scope: [
                'https://www.googleapis.com/auth/bigquery.readonly'
            ].join(' ')
        });
        this.loadGapi().subscribe();
    }

    public onLoad(): Observable<boolean> {
        return this.loadGapi();
    }

    public getConfig(): GoogleApiConfig {
        return this.config;
    }

    private loadGapi(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            const node = document.createElement('script');
            node.src = this.gapiUrl;
            node.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(node);
            node.onload = () => {
                observer.next(true);
                observer.complete();
            };
        });
    }
}
