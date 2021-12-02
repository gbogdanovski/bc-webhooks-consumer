import fetch from "cross-fetch";
import config from "../common/config";
import { AecRealtimeConsumerModel } from "../models/aec-realtime-consumer.model";
import { BcWebhookBaseModel } from "../models/bc-webhook-base.model";
import { BcWebhookConfig } from "../models/bc-webhook-config.model";
import { ShopModel } from "../models/shop.model";
import { KeycloakAuthService } from "./KeyCloakAuthService";

export class PayloadShipper {

    public async ShipToAec(payload: AecRealtimeConsumerModel) {
        const keycloakAuthService = new KeycloakAuthService();
        try {
            if (!keycloakAuthService.keycloakToken) { console.error("No Keycloak token. Cancel the request or wait for it."); return; }
            if (!config.kongUrl) { console.error(`ENV variable KONG_URL is empty`); return; }

            console.log("Sending payload to AEC", payload);

            const httpResult = await fetch(String(config.kongUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloakAuthService.keycloakToken?.access_token}`
                },
                body: JSON.stringify(payload)
            });
            const result = await httpResult.json();
            console.log(result);
        }
        catch (error) {
            console.error('Sending payload to AEC failed', { error: error, payload: payload });
        }
    }

    public PreparePayloadForCidp(webhookPayload: BcWebhookBaseModel<any>, idPayload: BcWebhookConfig, shop: ShopModel) {
        try {
            if (idPayload.isProductInventoryEvent) {
                let payload = {
                    "id": `${webhookPayload.data['id']}`,
                    "type": "product",
                    "attributes": {
                        "inventory": `${webhookPayload.data['inventory']['value']}`
                    }
                };

                this.SendToCidp(payload, shop);
            }

            if (idPayload.isSkuInventoryEvent) {
                let payload = {
                    "id": `${webhookPayload.data['id']}`,
                    "type": "variant",
                    "attributes": {
                        "inventory": `${webhookPayload.data['inventory']['value']}`
                    },
                    "parentId": `${webhookPayload.data['inventory']['product_id']}`
                };

                this.SendToCidp(payload, shop);
            }
        }
        catch (error) {
            console.error('Preparing payload to CIDP failed', error);
        }
    }

    private async SendToCidp(payload: any, shop: ShopModel) {
        try {
            const keycloakAuthService = new KeycloakAuthService();
            if (!keycloakAuthService.keycloakToken) { console.error("No Keycloak token. Cancel the request or wait for it."); return; }
            if (!config.cidpUrl) { console.error(`ENV variable CIDP_URL is empty`); return; }

            const requestInit: RequestInit = {
                headers: {
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${keycloakAuthService.keycloakToken?.access_token}`
                },
                method: 'PATCH',
                body: JSON.stringify([payload])
            };

            const url = `${String(config.cidpUrl)}?tenant=${shop.tenantName}&environment=${shop.tenantEnvName}${process.env.NODE_ENV === 'production' ? '&async=true' : ''}`;
            //console.log("Sending payload to CIDP", { url, payload: JSON.stringify([payload]), request: requestInit });
            const httpResult = await fetch(url, requestInit);
            const result = await httpResult.json();
            console.log('Sending payload to CIDP result', result);
        }
        catch (error) {
            console.error('Sending payload to CIDP failed', { error, payload: payload });
        }
    }

}