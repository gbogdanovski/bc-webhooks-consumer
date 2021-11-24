import { config } from "dotenv";
config();
export default {
    port: process.env.PORT || 8000,
    webhookCustomHeaderName: process.env.WEBHOOK_CUSTOM_HEADER_NAME || "X-GCP-Webhook-Signature",
    keycloakUrl: process.env.KEYCLOAK_URL || "http://iam-dev.attraqt.io/auth/realms/master/protocol/openid-connect/token",
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID || "attraqt-aec",
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "917b4372-e40e-44fb-b3dd-4223f8c87ba1",
}