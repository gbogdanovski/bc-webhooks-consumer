import express, { Request, Response } from "express";
import config from "../core/common/config";
import { FirebaseService } from "../core/services/firebase.service";
import { KeycloakAuthService } from "../core/services/keycloak-auth.service";

export const statusController = express.Router();

statusController.get("/", async (req: Request, res: Response) => {
    try {
        let status = "BC app webhooks consumer status: ";

        if (!config.cidpUrl)
            status += "<br/>- ENV variable CIDP_URL: <span style='color:red;'>Payload wont be shipped to CIDP</span>";
        else
            status += "<br/>- ENV variable CIDP_URL: <span style='color:green'>OK</span>";

        if (!config.kongUrl)
            status += "<br/>- ENV variable KONG_URL: <span style='color:red;'>Payload wont be shipped to AEC</span>";
        else
            status += "<br/>- ENV variable KONG_URL: <span style='color:green'>OK</span>";

        status += "<br/>- Payload ledger: " + (config.enablePayloadLedger ? "<span style='color:green'>ON</span>" : "<span style='color:red;'>OFF</span>");

        const keycloakAuthService = new KeycloakAuthService();
        if (!keycloakAuthService.keycloakToken)
            status += "<br/>- Keycloak - <span style='color:red;'>Keycloak token not found</span>";
        else
            status += "<br/>- Keycloak - <span style='color:green'>OK</span>";

        const firebaseService = new FirebaseService();
        if (await firebaseService.isCollectionEmpty())
            status += "<br/>- Firebase - <span style='color:red;'>Collection Shops is empty</span>";
        else
            status += "<br/>- Firebase - <span style='color:green'>OK</span>";

        res.status(200).send(status);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});