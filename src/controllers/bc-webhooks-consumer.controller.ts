import express, { Request, Response } from "express";
import config from "../core/common/config";
import { extractWebhookData } from "../core/common/utils";
import { BcWebHookBaseModel } from "../core/models/bc-webhook-base.model";
import { BcWebHookDataBaseModel } from "../core/models/bc-webhook-data-base.model";
import { FirebaseService } from "../core/services/FirebaseService";

export const bcWebhooksConsumerController = express.Router();
const firebaseService = new FirebaseService();

bcWebhooksConsumerController.post("/", async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) throw new Error("No body found in request");
        res.status(200).send(await validateWebhookData(req));
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

const validateWebhookData = async (req: Request) => {
    const body: BcWebHookBaseModel<BcWebHookDataBaseModel> = req.body;
    const aecHeaderValue = req.headers[String(config.webhookCustomHeaderName).toLowerCase()];
    const scopeType = extractWebhookData(body);
    const shops = await firebaseService.getShops();

    if (aecHeaderValue && shops.find(x => x.webhooksToken === aecHeaderValue)) {
        const shop = shops.find(x => x.webhooksToken === aecHeaderValue && x.storeHash === scopeType.storeHash);
        console.log(body);
        return { shop, header: aecHeaderValue, scopeType: scopeType, body };
    }
    else {
        console.log("Invalid token");
    }
}