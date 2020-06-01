import ClientConfig = gapi.auth2.ClientConfig;

/**
 * Extends the ClientConfig found in the gapi library
 * and adds the discoveryDocs property.
 */
export interface GapiClientConfig extends ClientConfig {
    discoveryDocs: string[];
}

/**
 * A simple class that holds the GapiClientConfig of the app
 */
export class GoogleApiConfig {
    protected clientConfig: GapiClientConfig;

    constructor(clientConfig: GapiClientConfig) {
        this.clientConfig = clientConfig;
    }

    public getClientConfig(): GapiClientConfig {
        return this.clientConfig;
    }
}
