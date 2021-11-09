import express, { Request, Response } from "express";
import { BcWebhookProductCreatedModel } from "../core/models/bc-webhook-product-created.model";
import { BcWebHookBaseModel } from "../core/models/bc-wehbook-base.model";
export const bcWebhooksConsumerController = express.Router();

bcWebhooksConsumerController.post("/", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        res.send(body as BcWebHookBaseModel<BcWebhookProductCreatedModel>);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});