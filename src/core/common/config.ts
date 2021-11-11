import { config } from "dotenv";
config();

export default {
    port: process.env.PORT || 9000,
    gcpAuthorize: {
        apiKeyJson: process.env.GCP_KEY_JSON_B64
            ? Buffer.from(process.env.GCP_KEY_JSON_B64!, "base64").toString("utf-8")
            : null,
    },
    webhookCustomHeaderName: process.env.WEBHOOK_CUSTOM_HEADER_NAME || "X-GCP-Webhook-Signature",
}