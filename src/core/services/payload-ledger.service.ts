import { PayloadLedgerModel } from "../models/payload-ledger.model";
import { PayloadValidator } from "./payload-validator.service";

/**
 * PayloadLedgerService class is used to store in runtime all failed shipments of the BC webhooks to the consumers.
 */
export class PayloadLedgerService {
    constructor() {
        if (PayloadLedgerService.instance) {
            return PayloadLedgerService.instance;
        }
        PayloadLedgerService.instance = this;
    }
    private static instance: PayloadLedgerService = new PayloadLedgerService(); //singleton instance
    public failedPayload: PayloadLedgerModel[] = [];

    AddPayloadToLedger(payload: any, aecHeaderValue: string, hash: string) {
        if (!this.failedPayload.some(x => x.hash === hash)) this.failedPayload.push({ payload, aecHeaderValue, hash });
    }

    RemovePayloadFromLedger(hash: string) {
        this.failedPayload = this.failedPayload.filter(x => x.hash !== hash);
    }

    // TODO do proper logic
    TryToReshipPayload() {
        if (this.failedPayload.length > 0) {
            setTimeout(() => {
                this.failedPayload.forEach(x => {
                    const payloadValidator = new PayloadValidator();
                    payloadValidator.ValidateAndRouteWebhookData(x.payload, x.aecHeaderValue)
                });
            }, 5000);
        }
    }
}

