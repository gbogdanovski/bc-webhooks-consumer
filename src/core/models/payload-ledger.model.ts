import { BcWebhookBaseModel } from "./bc-webhook-base.model";

export interface PayloadLedgerModel {
    hash: string;
    payload: BcWebhookBaseModel,
    aecHeaderValue: string;
}