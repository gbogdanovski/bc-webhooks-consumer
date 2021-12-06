import { config } from "dotenv";
config();
export default {
    port: process.env.PORT || 8000,
    webhookCustomHeaderName: process.env.WEBHOOK_CUSTOM_HEADER_NAME || "Attraqt-Access-Token~",
    keycloakUrl: process.env.KEYCLOAK_URL,
    keycloakClientId: process.env.KEYCLOAK_CLIENT_ID,
    keycloakClientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    kongUrl: process.env.KONG_URL,
    cidpUrl: process.env.CIDP_URL,
    enablePayloadLedger: (process.env.ENABLE_PAYLOAD_LEDGER && process.env.ENABLE_PAYLOAD_LEDGER === 'true' ? true : false) || false,
    payloadLedgerReshipTimeoutInSeconds: process.env.PAYLOAD_LEDGER_RESHIP_TIMEOUT_IN_SECONDS || 5,
    refreshTokenBeforeExpiresInSeconds: process.env.REFRESH_TOKEN_BEFORE_EXPIRES_IN_SECONDS || 5
}