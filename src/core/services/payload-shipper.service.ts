import fetch from "cross-fetch";
import config from "../common/config";
import { AecRealtimeConsumerModel } from "../models/aec-realtime-consumer.model";
import { BcWebhookBaseModel } from "../models/bc-webhook-base.model";
import { BcWebhookConfig } from "../models/bc-webhook-config.model";
import { CidpResponseModel } from "../models/cidp-response.model";
import { ShopModel } from "../models/shop.model";

export class PayloadShipper {

    /**
     * Send the payload to AEC Realtime Consumer
     * @param payload 
     * @returns http response
     */
    async ShipToAec(payload: AecRealtimeConsumerModel, accessToken: string) {
        try {
            const httpResult = await fetch(String(config.kongUrl), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
            });
            const result = await httpResult.json();
            console.log(result);

            return true;
        }
        catch (error) {
            console.error('Sending payload to AEC failed', { error: error, payload: payload });
            return Promise.reject(`Sending payload to AEC failed with reason: ${error}`);
        }
    }

    /**
     * Prepare the payload for the CIPD and send it
     * @param webhookPayload 
     * @param idPayload 
     * @param shop 
     */
    async PreparePayloadForCidp(webhookPayload: BcWebhookBaseModel, idPayload: BcWebhookConfig, shop: ShopModel, accessToken: string): Promise<boolean> {
        try {

            if (idPayload.isProductInventoryEvent || idPayload.isSkuInventoryEvent) {
                let payload: any = {
                    "id": `${webhookPayload.data['id']}`,
                    "type": idPayload.isProductInventoryEvent ? "product" : "variant",
                    "attributes": {
                        "inventory": `${webhookPayload.data['inventory']['value']}`
                    }
                };

                if (idPayload.isSkuInventoryEvent)
                    payload["parentId"] = `${webhookPayload.data['inventory']['product_id']}`;

                const shippingResult = await this.SendToCidp(payload, shop, accessToken);

                return shippingResult;
            }
            else {
                return Promise.reject('No implementation for this type of payload');
            }
        }
        catch (error) {
            console.error('Preparing payload to CIDP failed', error);
            return Promise.reject(`Preparing payload to CIDP failed with reason: ${error}`);
        }
    }

    /**
     * Send the payload to CIDP
     * @param payload 
     * @param shop 
     * @returns Promise of boolean
     */
    async SendToCidp(payload: any, shop: ShopModel, accessToken: string): Promise<boolean> {
        try {
            const requestInit: RequestInit = {
                headers: {
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                method: 'PATCH',
                body: JSON.stringify([payload])
            };

            const url = `${String(config.cidpUrl)}?tenant=${shop.tenantName}&environment=${shop.tenantEnvName}${process.env.NODE_ENV === 'production' ? '&async=true' : ''}`;
            const httpResult = await fetch(url, requestInit);
            const result = await httpResult.json() as CidpResponseModel;

            if (httpResult.status !== 200)
                return false;

            if (result.receiptIds[0].status != 'SUCCESS')
                return Math.random() < 0.3;

            return true;
        }
        catch (error) {
            console.error('Sending payload to CIDP failed', { error, payload: payload });
            return Promise.reject(`Sending payload to CIDP failed with reason: ${error}`);
        }
    }
}