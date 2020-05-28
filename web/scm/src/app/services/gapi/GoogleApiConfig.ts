import ClientConfig = gapi.auth2.ClientConfig;

export interface GapiClientConfig extends ClientConfig {
    discoveryDocs: string[];
}

export class GoogleApiConfig {
    protected clientConfig: GapiClientConfig;

    constructor(clientConfig: GapiClientConfig) {
        this.clientConfig = clientConfig;
    }

    public getClientConfig(): GapiClientConfig {
        return this.clientConfig;
    }
}
