import { BcWebhookBaseModel } from "./bc-webhook-base.model";
import { ShopModel } from "./shop.model";

export interface AecRealtimeConsumerModel {
    customer: ShopModel;
    data: BcWebhookBaseModel;
}