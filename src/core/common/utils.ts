import { BcWebhookBaseModel } from "../models/bc-webhook-base.model";
import { BcWebhookConfig } from "../models/bc-webhook-config.model";

export const extractWebhookData = (webhookPayload: BcWebhookBaseModel<any>): BcWebhookConfig => {
    const splitScope = webhookPayload.scope.split('/');
    const scopeType = splitScope.length == 3 ? `${splitScope[splitScope.length - 2]}_${splitScope[splitScope.length - 1]}` : `${splitScope[splitScope.length - 3]}_${splitScope[splitScope.length - 2]}_${splitScope[splitScope.length - 1]}`;
    const storeHash = webhookPayload.producer.split('/')[1];
    return {
        scopeType: scopeType,
        storeHash: storeHash,
        isProductInventoryEvent: splitScope.some(x => x.toLowerCase() === "inventory") && splitScope.some(x => x.toLowerCase() === "product"),
        isSkuInventoryEvent: splitScope.some(x => x.toLowerCase() === "inventory") && splitScope.some(x => x.toLowerCase() === "sku"),
        actionType: splitScope[splitScope.length - 1]
    } as BcWebhookConfig;
}