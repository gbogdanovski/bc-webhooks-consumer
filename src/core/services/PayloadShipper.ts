import fetch from "cross-fetch";
import config from "../common/config";
import { AecRealtimeConsumerModel } from "../models/aec-realtime-consumer.model";
import { KeycloakAuthService } from "./KeyCloakAuthService";

export class PayloadShipper {

    public ShipToAec(payload: AecRealtimeConsumerModel) {
        const keycloakAuthService = new KeycloakAuthService();
        try {
            if (!keycloakAuthService.keycloakToken) console.log("No Keycloak token. Cancel the request or wait for it.");
            if (!config.kongUrl) { console.log(`ENV variable KONG_URL is empty`); return; }

            fetch(String(config.kongUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloakAuthService.keycloakToken?.access_token}`
                },
                body: JSON.stringify(payload)
            });
        }
        catch (error) {
        }
    }

    public ShipToCidp(payload: AecRealtimeConsumerModel) {
        const keycloakAuthService = new KeycloakAuthService();
        try {
            if (!keycloakAuthService.keycloakToken) console.log("No Keycloak token. Cancel the request or wait for it.");
            if (!config.cidpUrl) { console.log(`ENV variable CIDP_URL is empty`); return; }

            fetch(String(config.cidpUrl), {
                method: 'POST',
                headers: {
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloakAuthService.keycloakToken?.access_token}`
                },
                body: JSON.stringify(payload)
            });
        }
        catch (error) {
        }
    }

}