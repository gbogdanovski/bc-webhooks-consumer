import express, { Request, Response } from "express";
import config from "../core/common/config";
import { extractWebhookData } from "../core/common/utils";
import { AecRealtimeConsumerModel } from "../core/models/aec-realtime-consumer.model";
import { BcWebhookBaseModel } from "../core/models/bc-webhook-base.model";
import { BcWebhookConfig } from "../core/models/bc-webhook-config.model";
import { ShopModel } from "../core/models/shop.model";
import { FirebaseService } from "../core/services/FirebaseService";
import { PayloadShipper } from "../core/services/PayloadShipper";

export const bcWebhooksConsumerController = express.Router();
const firebaseService = new FirebaseService();
const payloadShipper = new PayloadShipper();

bcWebhooksConsumerController.post("/", async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) throw new Error("No body found in request");
        res.status(200).send(await validateWebhookData(req));
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

const validateWebhookData = async (req: Request) => {
    const webhookPayload: BcWebhookBaseModel<any> = req.body;

    const aecHeaderValue = req.headers[String(config.webhookCustomHeaderName).toLowerCase()];
    if (!aecHeaderValue) throw new Error("No AEC header found in request");

    const idPayload = extractWebhookData(webhookPayload);

    const isValidShop = (firebaseService.shopWebhooksData ?? await firebaseService.getShops()).find(x => x.webhooksToken === aecHeaderValue && x.storeHash === idPayload.storeHash);

    if (isValidShop) {
        idPayload.tenantId = String(isValidShop.tenantId);
        payloadRouter(webhookPayload, idPayload, isValidShop);
        return true;
    }
    else {
        console.log("Invalid token");
        throw new Error(`The shop with store hash '${idPayload.storeHash}' was not found in firebase collection`);
    }
}


const payloadRouter = async (webhookPayload: BcWebhookBaseModel<any>, idPayload: BcWebhookConfig, shop: ShopModel) => {
    if (idPayload.isProductInventoryEvent || idPayload.isSkuInventoryEvent) {
        console.log("send Inventory event to CIDP", idPayload);
        payloadShipper.PreparePayloadForCidp(webhookPayload, idPayload, shop);
    }
    else {
        payloadShipper.ShipToAec({ customer: shop, data: webhookPayload });
    }
}

