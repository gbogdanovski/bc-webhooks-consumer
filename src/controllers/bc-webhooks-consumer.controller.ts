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
        if (!req.body) throw new Error("No body found in request");
        validateWebhookData(req);
        res.status(200).send();
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

const validateWebhookData = async (req: Request) => {
    const body: BcWebHookBaseModel<BcWebHookDataBaseModel> = req.body;
    const aecHeaderValue = req.headers[String(config.webhookCustomHeaderName).toLowerCase()];
    const scopeType = extractWebhookData(body);
    const shops = await firebaseService.shopWebhooksData;

    if (aecHeaderValue && shops.find(x => x.webhooksToken === aecHeaderValue)) {
        const shop = shops.find(x => x.webhooksToken === aecHeaderValue);
        console.log(body);
        //console.log(`Scope type: ${scopeType.scopeType} with header value: ${aecHeaderValue} and for shop hash: ${shop?.storeHash} and hook hash ${body.hash}`);
    }
    else {
        console.log("Invalid token");
    }
}