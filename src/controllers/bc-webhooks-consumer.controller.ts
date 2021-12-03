import express, { Request, Response } from "express";
import config from "../core/common/config";
import { BcWebhookBaseModel } from "../core/models/bc-webhook-base.model";
import { PayloadValidator } from "../core/services/payload-validator.service";

export const bcWebhooksConsumerController = express.Router();
const payloadValidator = new PayloadValidator();

bcWebhooksConsumerController.post("/", async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) throw new Error("No body found in request");

        const aecHeaderValue = req.headers[String(config.webhookCustomHeaderName).toLowerCase()];
        if (!aecHeaderValue)
            throw new Error("No AEC header found in request");

        const webhookPayload: BcWebhookBaseModel = req.body;
        const validationResult = await payloadValidator.ValidateAndRouteWebhookData(webhookPayload, String(aecHeaderValue));
        res.status(200).send(validationResult);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});
