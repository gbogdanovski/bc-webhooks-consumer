import { BcWebhookBaseModel } from "./bc-webhook-base.model";

export interface AecRealtimeConsumerModel {
    customer: {
        provider: string,
        storeHash: string
    };
    data: BcWebhookBaseModel;
}