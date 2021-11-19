import { config } from "dotenv";
config();
export default {
    port: process.env.PORT || 9000,
    webhookCustomHeaderName: process.env.WEBHOOK_CUSTOM_HEADER_NAME || "X-GCP-Webhook-Signature",
}