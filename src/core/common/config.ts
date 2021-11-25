import { config } from "dotenv";
config();
export default {
    port: process.env.PORT || 8000,
    webhookCustomHeaderName: process.env.WEBHOOK_CUSTOM_HEADER_NAME || "Attraqt-Access-Token",
    keycloakUrl: process.env.KEYCLOAK_URL,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
}