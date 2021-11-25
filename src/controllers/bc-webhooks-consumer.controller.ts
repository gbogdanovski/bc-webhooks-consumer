import express, { Request, Response } from "express";
import config from "../core/common/config";
import { extractWebhookData } from "../core/common/utils";
import { BcWebhookBaseModel } from "../core/models/bc-webhook-base.model";
import { BcWebhookConfig } from "../core/models/bc-webhook-config.model";
import { FirebaseService } from "../core/services/FirebaseService";
import { KeycloakAuthService } from "../core/services/KeyCloakAuthService";

export const bcWebhooksConsumerController = express.Router();
const firebaseService = new FirebaseService();
const keycloakAuthService = new KeycloakAuthService();

bcWebhooksConsumerController.post("/", async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) throw new Error("No body found in request");
        res.status(200).send(await validateWebhookData(req));
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

const validateWebhookData = async (req: Request) => {
    const webhookPayload: BcWebhookBaseModel = req.body;

    const aecHeaderValue = req.headers[String(config.webhookCustomHeaderName).toLowerCase()];
    if (!aecHeaderValue) throw new Error("No AEC header found in request");

    const idPalyload = extractWebhookData(webhookPayload);
    const shops = await firebaseService.getShops();
    const isValidShop = shops.find(x => x.webhooksToken === aecHeaderValue && x.storeHash === idPalyload.storeHash)

    if (isValidShop) {
        payloadRouter(webhookPayload, idPalyload);
        return { isValidShop, webhookPayload, idPalyload };
    }
    else {
        console.log("Invalid token");
        throw new Error(`The shop with store hash '${idPalyload.storeHash}' was not found in firebase collection`);
    }
}

const payloadRouter = async (webhookPayload: BcWebhookBaseModel, idPayload: BcWebhookConfig) => {

    if (idPayload.isInventoryEvent) {
        console.log("send Inventory event to CIDP");
    }
    else {
        console.log("send event to AEC");
    }
    console.log(keycloakAuthService.keycloakToken?.expires_in);
}