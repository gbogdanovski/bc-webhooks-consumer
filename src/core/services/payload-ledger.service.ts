import config from "../common/config";
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
    private reShipperInterval: any;

    AddPayloadToLedger(payload: any, aecHeaderValue: string, hash: string) {
        if (!this.failedPayload.some(x => x.hash === hash)) this.failedPayload.push({ payload, aecHeaderValue, hash });
    }

    /**
     * Removes the payload from the ledger if previously added on failed shipping.
     * @param hash Hashed value of the BC webhook payload
     */
    RemovePayloadFromLedger(hash: string) {
        this.failedPayload = this.failedPayload.filter(x => x.hash !== hash);

        if (this.failedPayload.length === 0) {
            console.log(`Payload Ledger: No payloads to reship at ${new Date().toUTCString()}`);
        }
    }

    /**
     * TryToReshipPayload method is used to reship all failed payloads to the consumers.
     * Reshipment will run every { ENV PAYLOAD_LEDGER_RESHIP_TIMEOUT } milliseconds until all failed payloads are successfully or GCP kill the pod.
     */
    TryToReshipPayload() {
        this.reShipperInterval = setInterval(() => {
            if (this.failedPayload.length > 0) {
                const payloadShipper: Promise<boolean>[] = [];
                this.failedPayload.forEach(x => {
                    const payloadValidator = new PayloadValidator();
                    payloadShipper.push(payloadValidator.ValidateAndRouteWebhookData(x.payload, x.aecHeaderValue));
                });
                Promise.all(payloadShipper).finally(() => {
                    console.log(`Payload Ledger: ${this.failedPayload.length} payloads has been reshipped at ${new Date().toUTCString()}`);
                });
            }
        }, Number(config.payloadLedgerReshipTimeoutInSeconds) * 1000);
    }
}

