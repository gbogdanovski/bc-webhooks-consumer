import express, { Request, Response } from "express";
import { getWebhookConfig } from "../core/common/utils";
import { BcWebHookBaseModel } from "../core/models/bc-webhook-base.model";
import { BcWebHookDataBaseModel } from "../core/models/bc-webhook-data-base.model";
import { FirebaseService } from "../core/services/FirebaseService";
export const bcWebhooksConsumerController = express.Router();
const firebaseService = new FirebaseService();

bcWebhooksConsumerController.post("/", async (req: Request, res: Response) => {
    try {
        //console.log(req.body);
        if (!req.body) throw new Error("No body found in request");

        const webhookData: BcWebHookBaseModel<BcWebHookDataBaseModel> = req.body;
        const scopeType = getWebhookConfig(webhookData);
        const shops = await firebaseService.shopWebhooksData;
        res.send(shops);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});