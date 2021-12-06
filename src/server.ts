import express from "express";
import cors from "cors";
import helmet from "helmet";
import { bcWebhooksConsumerController } from "./controllers/bc-webhooks-consumer.controller";
import { errorHandlerMiddleware } from "./core/middleware/error.middleware";
import { statusController } from "./controllers/status.controller";
import { KeycloakAuthService } from "./core/services/keycloak-auth.service";
import { FirebaseService } from "./core/services/firebase.service";
import { PayloadLedgerService } from "./core/services/payload-ledger.service";
import config from "./core/common/config";

const keycloakAuthService = new KeycloakAuthService();
keycloakAuthService.doAuth();

const firebaseService = new FirebaseService();
firebaseService.attachListener();

if (config.enablePayloadLedger) {
    const payloadLedgerService = new PayloadLedgerService();
    payloadLedgerService.TryToReshipPayload();
}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/bc-webhooks-consumer", bcWebhooksConsumerController);
app.use("/", statusController);
app.use(errorHandlerMiddleware);
app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});

process.on('SIGTERM', function () {
    console.log('received SIGTERM, exiting gracefully');
    process.exit(0);
});