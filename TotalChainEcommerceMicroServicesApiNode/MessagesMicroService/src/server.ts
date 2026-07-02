import dotenv from "dotenv"; dotenv.config();
import express from "express"; import cors from "cors";
import swaggerUi from "swagger-ui-express"; import swaggerSpec from "./core/config/swagger";
import { errorHandler } from "./api/middleware/errorHandler";
import { requestLogger } from "./api/middleware/requestLogger";
import { rateLimiter } from "./api/middleware/rateLimiter";
import { sequelize } from "./core/config/database";
import messagesRoutes from "./api/routes/messagesRoutes";
import notificationWorker from "./services/notificationWorker";

const app = express(); const PORT = process.env.PORT || 5009;
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()) : ["http://localhost:3000"];
app.use(cors({ origin: corsOrigins, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"], credentials: true }));
app.options("*", cors()); app.use(express.json()); app.use(requestLogger); app.use(rateLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true, customSiteTitle: "MessagesMicroService", swaggerOptions: { persistAuthorization: true } }));

app.use("/api/messages", messagesRoutes);

app.use(errorHandler);
async function start() { try { await sequelize.authenticate(); await sequelize.sync(); notificationWorker.start(); app.listen(PORT, () => { console.log(`MessagesMicroService on port ${PORT}`); }); } catch (e) { console.error("Start error:", e); process.exit(1); } } start();
export default app;
