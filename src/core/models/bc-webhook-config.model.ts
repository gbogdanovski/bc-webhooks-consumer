export interface BcWebhookConfig {
    scopeType: string;
    storeHash: string;
    tenantId: string;
    isProductInventoryEvent: boolean;
    isSkuInventoryEvent: boolean;
    actionType: string;
}