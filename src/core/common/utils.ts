import { BcWebHookBaseModel } from "../models/bc-webhook-base.model";
import { BcWebhookConfig } from "../models/bc-webhook-config.model";
import { BcWebHookDataBaseModel } from "../models/bc-webhook-data-base.model";

export const getWebhookConfig = (webhookPayload: BcWebHookBaseModel<BcWebHookDataBaseModel>): BcWebhookConfig => {
    const splitScope = webhookPayload.scope.split('/');
    const scopeType = `${splitScope[splitScope.length - 2]}_${splitScope[splitScope.length - 1]}`;
    const storeHash = webhookPayload.producer.split('/')[1];
    return { scopeType: scopeType, storeHash: storeHash } as BcWebhookConfig;
}