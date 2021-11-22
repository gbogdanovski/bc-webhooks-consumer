import express from "express";
import cors from "cors";
import helmet from "helmet";
import { bcWebhooksConsumerController } from "./controllers/bc-webhooks-consumer.controller";
import { errorHandlerMiddleware } from "./core/middleware/error.middleware";
import { testController } from "./controllers/test.controller";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/bc-webhooks-consumer", bcWebhooksConsumerController);
app.use("/", testController);
app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
