import { FirebaseService } from "./firebase.service";
import { KeycloakAuthService } from "./keycloak-auth.service";
import config from "../common/config";
import { extractWebhookData } from "../common/utils";
import { BcWebhookBaseModel } from "../models/bc-webhook-base.model";
import { PayloadShipper } from "./payload-shipper.service";

export class PayloadValidator {

    /**
     * Takes the payload from the webhook and routes it to the correct consumer.
     * Doing validation of the payload and the shop.
     * @param req Express request
     * @returns boolean
     */
    async ValidateAndRouteWebhookData(webhookPayload: BcWebhookBaseModel, aecHeaderValue: string) {
        try {
            const keycloakAuthService = new KeycloakAuthService();

            if (!keycloakAuthService.keycloakToken)
                throw new Error("No Keycloak token. Cancel the request.");

            const firebaseService = new FirebaseService();
            const idPayload = extractWebhookData(webhookPayload);
            const isValidShop = (firebaseService.shopWebhooksData ?? await firebaseService.getShops()).find(x => x.webhooksToken === aecHeaderValue && x.storeHash === idPayload.storeHash);

            if (!isValidShop)
                throw new Error(`The shop with store hash '${idPayload.storeHash}' was not found in firebase collection.`);

            idPayload.tenantId = String(isValidShop.tenantId);

            const payloadShipper = new PayloadShipper();
            if (idPayload.isProductInventoryEvent || idPayload.isSkuInventoryEvent) {
                if (!config.cidpUrl)
                    throw new Error("ENV variable CIDP_URL is empty. Payload wont be shipped to CIDP.");

                return payloadShipper.PreparePayloadForCidp(webhookPayload, idPayload, isValidShop, String(keycloakAuthService.keycloakToken.access_token));
            }
            else {
                if (!config.kongUrl)
                    throw new Error("ENV variable KONG_URL is empty. Payload wont be shipped to AEC.");

                return payloadShipper.ShipToAec({ customer: isValidShop, data: webhookPayload }, String(keycloakAuthService.keycloakToken.access_token));
            }
        }
        catch (error) {
            console.error('Payload validation failed', { error: error, payload: webhookPayload });
            return Promise.reject(`Payload validation failed ${error}`);
        }
    }

}