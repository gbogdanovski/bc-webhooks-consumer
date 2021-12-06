import fetch from 'cross-fetch';
import config from '../common/config';
import { KeyCloakTokenModel } from '../models/key-cloak-token.model';

/**
 * KeycloakAuthService class is used for generating access token for sending data to CIDP.
 */
export class KeycloakAuthService {
    constructor() {
        if (KeycloakAuthService.instance) {
            return KeycloakAuthService.instance;
        }
        KeycloakAuthService.instance = this;
    }
    private static instance: KeycloakAuthService = new KeycloakAuthService(); //singleton instance
    public keycloakToken?: KeyCloakTokenModel = { isTokenValid: false }
    private basicAuthHeaderValue = Buffer.from(config.keycloakClientId + ':' + config.keycloakClientSecret).toString('base64');

    /**
     * Authenticates against keycloak and gets access token.
     * Access token is stored in keycloakToken property.
     * Initiates keepTokenAlive() method which will refresh access token every time it expires.
     */
    async doAuth() {
        try {
            console.log("Get keycloak token");
            const kcToken = await this.getToken();
            if (kcToken) {
                console.log("Keep keycloak token alive");
                this.keepTokenAlive();
            }
        }
        catch (error) {
            console.log("Error getting token from keycloak", error);
        }
    }

    /**
     * Keeps access token alive by sending request to keycloak 5 seconds before it expires.
     * If new access token request pass, the function will call itself again.
     */
    private keepTokenAlive() {
        setInterval(async () => {
            this.keycloakToken!.isTokenValid = false;
            await this.getToken();
            console.log("Keycloak token was refreshed");
        }, (Number(this.keycloakToken?.expires_in) - Number(config.refreshTokenBeforeExpiresInSeconds)) * 1000);
    }

    private async getToken(): Promise<KeyCloakTokenModel | undefined> {
        try {
            const getToken = await fetch(String(config.keycloakUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${this.basicAuthHeaderValue}`
                },
                body: `grant_type=client_credentials`
            });
            const result = await getToken.json();
            this.keycloakToken = result;
            this.keycloakToken!.isTokenValid = true;
            return Promise.resolve(this.keycloakToken);
        }
        catch (error) {
            console.log("Error getting token from keycloak", error);
            return Promise.reject(error);
        }
    }
}


